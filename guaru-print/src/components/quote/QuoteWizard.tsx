"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, CheckCircle2, ClipboardList, Copy, Loader2, Lock, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import type { ProductKey } from "@/content/types";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import type { CheckedFile } from "@/lib/files-client";
import { quoteList, useQuoteList, type ListEntry } from "@/lib/quote/list-store";
import { buildQuoteMessage, describeItem } from "@/lib/quote/message";
import { customerSchema, isProductKey, PRODUCT_MAP, PRODUCTS, type QuoteItem } from "@/lib/quote/products";
import type { Unit } from "@/lib/units";
import { whatsappUrl } from "@/lib/whatsapp";
import { CustomerForm, type CustomerValues } from "./CustomerForm";
import { FileDrop } from "./FileDrop";
import { ItemForm, toValues, type ItemValues } from "./ItemForm";

const STEPS = ["Produto", "Personalização", "Arte", "Seus dados", "Finalizar"] as const;

type Result = { reference: string; message: string; url: string; stored: boolean; links: number };

function uploadWithProgress(url: string, file: File, onProgress: (p: number) => void) {
  return new Promise<boolean>((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.setRequestHeader("content-type", file.type || "application/octet-stream");
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (anon) {
      xhr.setRequestHeader("apikey", anon);
      xhr.setRequestHeader("authorization", `Bearer ${anon}`);
    }
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => resolve(xhr.status >= 200 && xhr.status < 300);
    xhr.onerror = () => resolve(false);
    xhr.send(file);
  });
}

/**
 * Orçamento inteligente — 5 etapas, sem cadastro e sem preços.
 * Ao final abre o WhatsApp com a mensagem completa. Arquivos só viram link
 * quando há armazenamento seguro configurado (Supabase, bucket privado).
 */
export function QuoteWizard() {
  const params = useSearchParams();
  const list = useQuoteList();
  const [step, setStep] = useState(0);
  const [product, setProduct] = useState<ProductKey | null>(null);
  const [editing, setEditing] = useState<ListEntry | null>(null);
  const [files, setFiles] = useState<CheckedFile[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [progress, setProgress] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  const customer = useForm<CustomerValues>({
    resolver: zodResolver(customerSchema) as unknown as Resolver<CustomerValues>,
    defaultValues: { name: "", whatsapp: "", email: "", city: "", cep: "", notes: "", needsDesign: false, consent: false as unknown as true },
  });

  // Pré-preenchimento vindo de serviços, calculadora e simulador (?produto=…&largura=…).
  const prefill = useMemo(() => {
    const unit = params.get("unidade");
    return {
      width: params.get("largura") ?? undefined,
      height: params.get("altura") ?? undefined,
      unit: (unit === "mm" || unit === "cm" || unit === "m" ? unit : undefined) as Unit | undefined,
      quantity: params.get("qtd") ?? undefined,
    } satisfies Partial<ItemValues>;
  }, [params]);

  const paramKey = params.toString();
  const [appliedKey, setAppliedKey] = useState<string | null>(null);
  if (appliedKey !== paramKey) {
    setAppliedKey(paramKey);
    const p = params.get("produto");
    if (isProductKey(p)) {
      setProduct(p);
      setEditing(null);
      setStep(1);
    } else if (params.get("etapa") === "arte" && quoteList.get().length) {
      setStep(2);
    } else if (prefill.width && prefill.height) {
      setStep(0);
    }
    if (params.get("produto") || params.get("largura")) trackEvent("quote_start", { location: params.get("servico") ?? "params", service: p ?? undefined });
  }

  const goto = (n: number) => {
    setStep(n);
    setError(null);
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const chooseProduct = (key: ProductKey) => {
    setProduct(key);
    setEditing(null);
    goto(1);
  };

  const saveItem = (item: QuoteItem, next: "continue" | "another") => {
    if (editing) {
      quoteList.update(editing.id, item);
      setEditing(null);
    } else {
      quoteList.add(item);
      trackEvent("quote_list_add", { service: item.product, items: list.length + 1 });
    }
    if (next === "another") {
      setProduct(null);
      goto(0);
    } else goto(2);
  };

  const edit = (entry: ListEntry) => {
    setEditing(entry);
    setProduct(entry.product);
    goto(1);
  };

  const canReach = (n: number) => n <= step || (n >= 2 && list.length > 0) || (n === 1 && product);

  const send = async () => {
    const valid = await customer.trigger();
    if (!valid) return goto(3);
    if (!list.length) return goto(0);
    setStatus("sending");
    setError(null);
    const data = customerSchema.parse(customer.getValues());
    const items: QuoteItem[] = list.map(({ product, quantity, width, height, unit, details }) => ({ product, quantity, width, height, unit, details }));

    try {
      // 1) Referência + URLs de upload (quando há armazenamento seguro).
      setProgress(files.length ? "Preparando envio da arte…" : "Registrando solicitação…");
      const prep = await fetch("/api/quote/upload-url", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ files: files.map((f) => ({ name: f.file.name, size: f.file.size, type: f.file.type })) }),
      }).then((r) => (r.ok ? r.json() : null));

      const uploaded: string[] = [];
      if (prep?.storage && prep.uploads?.length) {
        for (const [i, up] of (prep.uploads as { path: string; signedUrl: string }[]).entries()) {
          const ok = await uploadWithProgress(up.signedUrl, files[i].file, (p) => setProgress(`Enviando arte ${i + 1} de ${files.length}… ${Math.round(p * 100)}%`));
          if (ok) uploaded.push(up.path);
        }
      }

      // 2) Registro da solicitação.
      setProgress("Gerando sua mensagem…");
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          request: { items, customer: data, source: "site" },
          reference: prep?.reference,
          ticket: prep?.ticket ?? null,
          uploaded,
          fileNames: files.map((f) => f.file.name),
        }),
      });
      const body = (await res.json().catch(() => null)) as { reference?: string; stored?: boolean; fileLinks?: { name: string; url: string }[]; error?: string } | null;
      if (!res.ok && res.status !== 400) throw new Error(body?.error ?? "Falha no envio");
      if (res.status === 400) throw new Error(body?.error ?? "Confira os dados do pedido.");

      const links = body?.fileLinks ?? [];
      // Links têm o prefixo "N-" com a posição do arquivo; os demais vão pelo chat.
      const storedIdx = new Set(links.map((l) => Number(l.name.split("-")[0]) - 1));
      const pendingNames = files.filter((_, i) => !storedIdx.has(i)).map((f) => f.file.name);
      const reference = body?.reference ?? prep?.reference ?? null;
      const message = buildQuoteMessage({ items, customer: data, reference, fileLinks: links, fileNames: pendingNames });
      finish({ reference: reference ?? "", message, stored: Boolean(body?.stored), links: links.length });
    } catch (e) {
      // Sem conexão com a API: ainda assim o cliente consegue enviar pelo WhatsApp.
      const message = buildQuoteMessage({ items, customer: data, reference: null, fileNames: files.map((f) => f.file.name) });
      if (e instanceof Error && /Confira|expirado/.test(e.message)) {
        setStatus("idle");
        setProgress(null);
        setError(e.message);
        return;
      }
      finish({ reference: "", message, stored: false, links: 0 });
    }
  };

  const finish = (r: Omit<Result, "url">) => {
    const url = whatsappUrl(r.message);
    trackEvent("quote_submit", { items: list.length, location: "wizard" });
    trackEvent("form_submit", { location: "quote" });
    setResult({ ...r, url });
    setStatus("done");
    setProgress(null);
    quoteList.clear();
    // Tenta abrir direto; se o navegador bloquear, o botão abaixo continua disponível.
    window.open(url, "_blank", "noopener,noreferrer");
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const restart = () => {
    setResult(null);
    setStatus("idle");
    setFiles([]);
    setProduct(null);
    customer.reset();
    goto(0);
  };

  if (status === "done" && result) {
    return (
      <div ref={top} className="card scroll-mt-28 p-6 text-center md:p-12">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16 }} className="mx-auto grid size-20 place-items-center rounded-full bg-[#25D366] text-ink">
          <CheckCircle2 className="size-10" aria-hidden />
        </motion.div>
        <h2 className="mt-6 font-display text-3xl md:text-4xl" role="status">
          Pedido pronto para envio!
        </h2>
        {result.reference && (
          <p className="mt-3 text-white/70">
            Referência: <strong className="font-mono text-paper">{result.reference}</strong>
          </p>
        )}
        <p className="mx-auto mt-3 max-w-lg text-white/70">
          Toque no botão abaixo para abrir a conversa com a mensagem já preenchida e envie para a nossa equipe.
          {result.links > 0
            ? " Sua arte foi enviada com segurança e o link privado já está na mensagem."
            : " Se você tem arquivos, anexe-os na conversa do WhatsApp."}
        </p>
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-14 items-center gap-3 rounded-full bg-[#25D366] px-8 font-sub text-lg font-semibold text-ink transition hover:brightness-110"
          onClick={() => trackEvent("whatsapp_click", { location: "quote-done" })}
        >
          <WhatsAppIcon className="size-6" /> Abrir WhatsApp com meu pedido
        </a>
        <details className="mx-auto mt-8 max-w-xl text-left">
          <summary className="cursor-pointer text-sm text-mute hover:text-paper">Ver mensagem</summary>
          <pre className="mt-3 max-h-80 overflow-auto rounded-2xl bg-ink p-4 text-xs whitespace-pre-wrap text-white/80">{result.message}</pre>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard?.writeText(result.message).catch(() => undefined);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            }}
            className="mt-2 inline-flex min-h-10 items-center gap-2 text-sm text-mute hover:text-paper"
          >
            {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />} {copied ? "Copiado" : "Copiar mensagem"}
          </button>
        </details>
        <button type="button" onClick={restart} className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-mute hover:text-paper">
          <RotateCcw className="size-4" aria-hidden /> Fazer outra solicitação
        </button>
      </div>
    );
  }

  return (
    <div ref={top} className="grid scroll-mt-28 gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="card min-w-0 p-5 md:p-10">
        {/* Etapas */}
        <nav aria-label="Etapas do orçamento">
          <ol className="flex gap-1.5">
            {STEPS.map((label, i) => (
              <li key={label} className="flex-1">
                <button
                  type="button"
                  disabled={!canReach(i)}
                  onClick={() => goto(i)}
                  aria-current={i === step ? "step" : undefined}
                  className="group w-full text-left disabled:cursor-not-allowed"
                >
                  <span className={cn("block h-1.5 rounded-full transition-colors duration-500", i < step ? "bg-cyan" : i === step ? "bg-paper" : "bg-white/10")} />
                  <span className={cn("mt-2 hidden text-xs font-semibold md:block", i === step ? "text-paper" : "text-mute group-enabled:group-hover:text-white/80")}>
                    {String(i + 1).padStart(2, "0")} · {label}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-mute md:hidden">
            Etapa {step + 1} de {STEPS.length}: <span className="text-paper">{STEPS[step]}</span>
          </p>
        </nav>

        <div className="mt-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={`${step}-${product}-${editing?.id}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              {step === 0 && (
                <div>
                  <h2 className="font-display text-2xl md:text-3xl">O que você precisa?</h2>
                  <p className="mt-1 text-sm text-mute">Escolha um produto. Você pode adicionar vários à mesma solicitação.</p>
                  {prefill.width && prefill.height && (
                    <p className="mt-4 rounded-xl bg-yellow/10 px-4 py-3 text-sm text-yellow">
                      Medidas da calculadora: {prefill.width} × {prefill.height} {prefill.unit ?? "cm"} — serão preenchidas no próximo passo.
                    </p>
                  )}
                  <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
                    {PRODUCTS.map((p, i) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => chooseProduct(p.key)}
                        className={cn(
                          "group relative min-h-28 overflow-hidden rounded-2xl border p-4 text-left transition",
                          product === p.key ? "border-cyan bg-cyan/10" : "border-white/10 bg-ink-2 hover:border-white/40",
                        )}
                      >
                        <span aria-hidden className="absolute -top-6 -right-6 size-16 rounded-full opacity-25 transition-transform duration-500 group-hover:scale-150" style={{ background: ["#00AEEF", "#E52B91", "#F7E500"][i % 3] }} />
                        <span className="relative block font-display text-lg">{p.label}</span>
                        <span className="relative mt-1 block text-xs text-mute">{p.description}</span>
                      </button>
                    ))}
                  </div>
                  {list.length > 0 && (
                    <div className="mt-8 flex justify-end">
                      <button type="button" onClick={() => goto(2)} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-paper px-6 font-sub font-semibold text-ink hover:bg-cyan">
                        Seguir com {list.length} {list.length === 1 ? "item" : "itens"} <ArrowRight className="size-4" aria-hidden />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {step === 1 && product && (
                <ItemForm
                  key={`${product}-${editing?.id ?? "new"}`}
                  product={product}
                  editing={Boolean(editing)}
                  initial={toValues(product, editing, editing ? undefined : prefill)}
                  onSave={saveItem}
                  onBack={() => goto(0)}
                />
              )}

              {step === 2 && (
                <div id="arte" className="scroll-mt-28">
                  <h2 className="font-display text-2xl md:text-3xl">Envie sua arte</h2>
                  <p className="mt-1 text-sm text-mute">Opcional. Se ainda não tiver, siga sem arquivo — a equipe orienta você.</p>
                  <div className="mt-8">
                    <FileDrop files={files} onChange={setFiles} />
                  </div>
                  <p className="mt-6 flex items-start gap-2 text-xs text-mute">
                    <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                    Arquivos ficam em armazenamento privado e só são acessados por link temporário. Eles não são anexados automaticamente ao WhatsApp.
                  </p>
                  <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    <button type="button" onClick={() => goto(list.length ? 0 : 1)} className="min-h-12 rounded-full px-5 text-sm font-semibold text-mute hover:text-paper">
                      Voltar
                    </button>
                    <button type="button" onClick={() => goto(3)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-paper px-6 font-sub font-semibold text-ink hover:bg-cyan">
                      {files.length ? "Continuar" : "Seguir sem arquivo"} <ArrowRight className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && <CustomerForm form={customer} onBack={() => goto(2)} onSubmit={async () => (await customer.trigger()) && goto(4)} />}

              {step === 4 && (
                <div>
                  <h2 className="font-display text-2xl md:text-3xl">Revise e envie</h2>
                  <p className="mt-1 text-sm text-mute">Confira o resumo. Ao enviar, abriremos o WhatsApp com tudo preenchido.</p>

                  <div className="mt-8 space-y-4">
                    {list.map((entry, i) => {
                      const d = describeItem(entry);
                      return (
                        <div key={entry.id} className="rounded-2xl border border-white/10 bg-ink-2 p-5">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-display text-lg">
                              {list.length > 1 && <span className="mr-2 text-white/30">{i + 1}.</span>}
                              {d.title}
                            </p>
                            <button type="button" onClick={() => edit(entry)} className="inline-flex min-h-10 items-center gap-1.5 text-sm text-mute hover:text-paper">
                              <Pencil className="size-3.5" aria-hidden /> Editar
                            </button>
                          </div>
                          <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                            {d.lines.map((l) => (
                              <div key={l.label} className="flex justify-between gap-3 border-b border-white/[0.05] py-1">
                                <dt className="text-mute">{l.label}</dt>
                                <dd className="text-right">{l.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      );
                    })}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-ink-2 p-5 text-sm">
                        <div className="flex items-center justify-between">
                          <p className="font-sub font-semibold">Arte</p>
                          <button type="button" onClick={() => goto(2)} className="text-mute hover:text-paper">
                            Alterar
                          </button>
                        </div>
                        <p className="mt-2 text-white/70">{files.length ? files.map((f) => f.file.name).join(", ") : "Nenhum arquivo enviado"}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-ink-2 p-5 text-sm">
                        <div className="flex items-center justify-between">
                          <p className="font-sub font-semibold">Contato</p>
                          <button type="button" onClick={() => goto(3)} className="text-mute hover:text-paper">
                            Alterar
                          </button>
                        </div>
                        <p className="mt-2 text-white/70">
                          {customer.getValues("name")} · {customer.getValues("whatsapp")}
                          <br />
                          {customer.getValues("city")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-6 rounded-xl bg-white/[0.04] px-4 py-3 text-xs leading-relaxed text-mute">
                    Valores e prazos são informados pela equipe após a análise do pedido. Nenhuma cobrança é feita pelo site.
                  </p>
                  {error && (
                    <p role="alert" className="mt-4 rounded-xl bg-magenta/10 px-4 py-3 text-sm text-[#ff8cc6]">
                      {error}
                    </p>
                  )}

                  <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button type="button" onClick={() => goto(3)} className="min-h-12 rounded-full px-5 text-sm font-semibold text-mute hover:text-paper">
                      Voltar
                    </button>
                    <button
                      type="button"
                      disabled={status === "sending" || !list.length}
                      onClick={send}
                      className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 font-sub font-semibold text-ink transition hover:brightness-110 disabled:opacity-60"
                    >
                      {status === "sending" ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <WhatsAppIcon className="size-5" />}
                      {status === "sending" ? "Enviando…" : "Enviar pelo WhatsApp"}
                    </button>
                  </div>
                  {progress && (
                    <p className="mt-3 text-right text-sm text-mute" aria-live="polite">
                      {progress}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Lista de orçamento */}
      <aside id="lista" className="scroll-mt-28 lg:sticky lg:top-28 lg:self-start" aria-labelledby="lista-title">
        <div className="card p-6">
          <div className="flex items-center gap-2">
            <ClipboardList className="size-5 text-cyan" aria-hidden />
            <h2 id="lista-title" className="font-sub font-semibold">
              Lista de orçamento
            </h2>
            <span className="ml-auto rounded-full bg-white/10 px-2.5 py-0.5 text-xs">{list.length}</span>
          </div>
          {list.length === 0 ? (
            <p className="mt-4 text-sm text-mute">Os produtos que você configurar aparecem aqui. Junte vários em uma única solicitação.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              <AnimatePresence initial={false}>
                {list.map((entry) => {
                  const d = describeItem(entry);
                  const summary = d.lines
                    .slice(0, 2)
                    .map((l) => l.value)
                    .join(" · ");
                  return (
                    <motion.li key={entry.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }} className="flex items-start gap-2 rounded-xl bg-ink-2 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{PRODUCT_MAP[entry.product].label}</p>
                        <p className="truncate text-xs text-mute">{summary}</p>
                      </div>
                      <button type="button" onClick={() => edit(entry)} className="grid size-9 place-items-center rounded-full text-mute hover:bg-white/10 hover:text-paper" aria-label={`Editar ${PRODUCT_MAP[entry.product].label}`}>
                        <Pencil className="size-3.5" />
                      </button>
                      <button type="button" onClick={() => quoteList.remove(entry.id)} className="grid size-9 place-items-center rounded-full text-mute hover:bg-white/10 hover:text-magenta" aria-label={`Remover ${PRODUCT_MAP[entry.product].label}`}>
                        <Trash2 className="size-3.5" />
                      </button>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
          {list.length > 0 && step < 2 && (
            <button type="button" onClick={() => goto(2)} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/15 text-sm font-semibold hover:border-white/40">
              Continuar com a lista <ArrowRight className="size-4" aria-hidden />
            </button>
          )}
        </div>
        <p className="mt-4 px-2 text-xs leading-relaxed text-mute">A lista fica salva neste navegador até você enviar a solicitação.</p>
      </aside>
    </div>
  );
}
