"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site";
import { publishedTreatments } from "@/content/treatments";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import {
  formatPhone,
  MESSAGE_MAX,
  validateContact,
  type ContactErrors,
  type ContactPayload,
} from "@/lib/contact";
import { supportsPrefilledMessage, whatsappUrl } from "@/lib/whatsapp";

type Status =
  | { type: "idle" }
  | { type: "sending" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const initial: ContactPayload = { name: "", phone: "", treatment: "", message: "", consent: false };

function buildWhatsappMessage(data: ContactPayload) {
  const treatment =
    data.treatment === "nao-sei"
      ? "Ainda não sei"
      : (publishedTreatments.find((t) => t.slug === data.treatment)?.name ?? data.treatment);
  const lines = [
    siteConfig.messages.general,
    "",
    `Nome: ${data.name.trim()}`,
    `Telefone: ${data.phone}`,
    `Interesse: ${treatment}`,
  ];
  if (data.message.trim()) lines.push(`Mensagem: ${data.message.trim()}`);
  return lines.join("\n");
}

/**
 * Formulário de contato.
 * - mode "whatsapp": abre o WhatsApp com a mensagem pronta (padrão).
 * - mode "webhook": envia para /api/contact, que repassa ao webhook configurado.
 */
export function ContactForm({ mode }: { mode: "whatsapp" | "webhook" }) {
  const id = useId();
  const [data, setData] = useState<ContactPayload>(initial);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const set = <K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const found = validateContact(data);
    setErrors(found);
    const firstError = Object.keys(found)[0];
    if (firstError) {
      form.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
      return;
    }

    trackEvent("form_submit", { location: "contact-form", treatment: data.treatment, channel: mode });

    if (mode === "whatsapp") {
      const message = buildWhatsappMessage(data);
      if (supportsPrefilledMessage) {
        window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
        setStatus({ type: "success", message: "Abrimos o WhatsApp com sua mensagem pronta. É só enviar!" });
      } else {
        // O link provisório não aceita texto pré-preenchido: copiamos a mensagem.
        let copied = false;
        try {
          await navigator.clipboard.writeText(message);
          copied = true;
        } catch {
          /* área de transferência indisponível */
        }
        window.open(whatsappUrl(), "_blank", "noopener,noreferrer");
        setStatus({
          type: "success",
          message: copied
            ? "Copiamos sua mensagem — basta colar na conversa do WhatsApp que acabou de abrir."
            : "Abrimos o WhatsApp da clínica. Envie seu nome e o tratamento de interesse para agendar.",
        });
      }
      setData(initial);
      return;
    }

    setStatus({ type: "sending" });
    try {
      const website = (form.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website }),
      });
      if (!res.ok) throw new Error();
      setStatus({ type: "success", message: "Recebemos seu contato! A equipe retornará em breve." });
      setData(initial);
    } catch {
      setStatus({
        type: "error",
        message: "Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.",
      });
    }
  };

  const field = (name: keyof ContactPayload) => ({
    id: `${id}-${name}`,
    name,
    "aria-invalid": Boolean(errors[name]) || undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
  });

  const errorText = (name: keyof ContactPayload) =>
    errors[name] ? (
      <p id={`${id}-${name}-error`} className="mt-2 text-xs text-[#9b3b31]">
        {errors[name]}
      </p>
    ) : null;

  const inputClass =
    "peer w-full rounded-none border-0 border-b border-ink/25 bg-transparent px-0 pt-6 pb-3 text-[0.95rem] text-ink transition-colors placeholder:text-transparent focus:border-ink focus:ring-0 focus:outline-none aria-[invalid=true]:border-[#9b3b31]";
  const labelClass =
    "pointer-events-none absolute top-6 left-0 text-[0.9rem] text-ink/60 transition-all duration-300 peer-focus:top-0 peer-focus:text-[0.7rem] peer-focus:tracking-[0.08em] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[0.7rem] peer-[:not(:placeholder-shown)]:tracking-[0.08em]";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7" aria-describedby={`${id}-privacy`}>
      {/* Honeypot anti-spam */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Não preencha
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="relative">
        <input
          {...field("name")}
          type="text"
          autoComplete="name"
          placeholder="Nome"
          maxLength={80}
          value={data.name}
          onChange={(e) => set("name", e.target.value)}
          className={inputClass}
        />
        <label htmlFor={`${id}-name`} className={labelClass}>
          Nome
        </label>
        {errorText("name")}
      </div>

      <div className="relative">
        <input
          {...field("phone")}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="Telefone"
          value={data.phone}
          onChange={(e) => set("phone", formatPhone(e.target.value))}
          className={inputClass}
        />
        <label htmlFor={`${id}-phone`} className={labelClass}>
          Telefone / WhatsApp
        </label>
        {errorText("phone")}
      </div>

      <div className="relative">
        <label htmlFor={`${id}-treatment`} className="block text-[0.7rem] tracking-[0.08em] text-ink/60">
          Tratamento de interesse
        </label>
        <select
          {...field("treatment")}
          value={data.treatment}
          onChange={(e) => set("treatment", e.target.value)}
          className="mt-1 w-full appearance-none rounded-none border-0 border-b border-ink/25 bg-transparent bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20fill=%22none%22%20stroke=%22%23252525%22%20stroke-width=%221.2%22%3E%3Cpath%20d=%22m2%204%204%204%204-4%22/%3E%3C/svg%3E')] bg-[length:12px] bg-[right_center] bg-no-repeat py-3 text-[0.95rem] focus:border-ink focus:outline-none aria-[invalid=true]:border-[#9b3b31]"
        >
          <option value="" disabled>
            Selecione
          </option>
          {publishedTreatments.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name}
            </option>
          ))}
          <option value="nao-sei">Ainda não sei</option>
        </select>
        {errorText("treatment")}
      </div>

      <div className="relative">
        <textarea
          {...field("message")}
          rows={3}
          placeholder="Mensagem"
          maxLength={MESSAGE_MAX}
          value={data.message}
          onChange={(e) => set("message", e.target.value)}
          className={cn(inputClass, "resize-none")}
        />
        <label htmlFor={`${id}-message`} className={labelClass}>
          Mensagem (opcional)
        </label>
        <p className="mt-2 flex justify-between text-[0.7rem] text-ink/55">
          <span>Não inclua informações de saúde — elas serão tratadas na avaliação.</span>
          <span aria-hidden>
            {data.message.length}/{MESSAGE_MAX}
          </span>
        </p>
        {errorText("message")}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[0.8rem] leading-relaxed text-ink/75">
          <input
            {...field("consent")}
            type="checkbox"
            checked={data.consent}
            onChange={(e) => set("consent", e.target.checked)}
            className="mt-1 size-4 shrink-0 accent-ink"
          />
          <span>
            Autorizo a J.A Odontologia Estética a entrar em contato e a tratar meus dados para responder a esta
            solicitação, conforme a{" "}
            <Link href="/politica-de-privacidade" className="underline underline-offset-4">
              Política de Privacidade
            </Link>
            .
          </span>
        </label>
        {errorText("consent")}
      </div>

      <p id={`${id}-privacy`} className="sr-only">
        {mode === "whatsapp"
          ? "Ao enviar, o WhatsApp será aberto em uma nova aba com sua mensagem."
          : "Ao enviar, seus dados serão encaminhados à equipe da clínica."}
      </p>

      <button
        type="submit"
        disabled={status.type === "sending"}
        className="group/cta inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-ink px-6 text-[0.82rem] font-medium tracking-[0.04em] text-offwhite transition-colors duration-500 hover:bg-[#3a3533] disabled:opacity-60 sm:w-auto"
      >
        {status.type === "sending"
          ? "Enviando…"
          : mode === "whatsapp"
            ? "Enviar pelo WhatsApp"
            : "Enviar mensagem"}
      </button>

      <div aria-live="polite" role="status">
        {(status.type === "success" || status.type === "error") && (
          <p
            className={cn(
              "rounded-2xl px-4 py-3 text-sm",
              status.type === "success" ? "bg-white/70 text-ink" : "bg-[#9b3b31]/10 text-[#7d2f27]",
            )}
          >
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
