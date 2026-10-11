"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { Customer } from "@/lib/quote/products";

export type CustomerValues = Customer;

export const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};
export const maskCep = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

/** Etapa 4 — dados do cliente. Nenhum cadastro ou senha. */
export function CustomerForm({ form, onSubmit, onBack }: { form: UseFormReturn<CustomerValues>; onSubmit: () => void; onBack: () => void }) {
  const id = useId();
  const [cepState, setCepState] = useState<"idle" | "loading" | "found" | "error">("idle");
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  // Preenche a cidade a partir do CEP (ViaCEP, serviço público gratuito).
  const lookupCep = async (cep: string) => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setCepState("loading");
    try {
      const ctrl = AbortSignal.timeout(5000);
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal: ctrl });
      const data = (await res.json()) as { localidade?: string; uf?: string; erro?: boolean };
      if (data.erro || !data.localidade) throw new Error("not found");
      if (!getValues("city")) setValue("city", `${data.localidade} - ${data.uf}`, { shouldValidate: true });
      setCepState("found");
    } catch {
      setCepState("error");
    }
  };

  const err = (name: keyof CustomerValues) => errors[name]?.message as string | undefined;
  const fieldProps = (name: keyof CustomerValues) => ({ id: `${id}-${name}`, "aria-invalid": Boolean(err(name)), "aria-describedby": err(name) ? `${id}-${name}-err` : undefined });
  const errorText = (name: keyof CustomerValues) =>
    err(name) ? (
      <p id={`${id}-${name}-err`} className="mt-1.5 text-sm text-magenta">
        {err(name)}
      </p>
    ) : null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      noValidate
    >
      <h2 className="font-display text-2xl md:text-3xl">Seus dados</h2>
      <p className="mt-1 text-sm text-mute">Sem cadastro e sem senha — usamos estes dados apenas para responder ao seu orçamento.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="label">
            Nome <span className="text-magenta">*</span>
          </label>
          <input {...fieldProps("name")} autoComplete="name" className="field" {...register("name")} />
          {errorText("name")}
        </div>
        <div>
          <label htmlFor={`${id}-whatsapp`} className="label">
            WhatsApp <span className="text-magenta">*</span>
          </label>
          <input
            {...fieldProps("whatsapp")}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(13) 99999-9999"
            className="field"
            {...register("whatsapp", { onChange: (e) => setValue("whatsapp", maskPhone(e.target.value)) })}
          />
          {errorText("whatsapp")}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="label">
            E-mail <span className="font-normal text-mute">(opcional)</span>
          </label>
          <input {...fieldProps("email")} type="email" inputMode="email" autoComplete="email" className="field" {...register("email")} />
          {errorText("email")}
        </div>
        <div>
          <label htmlFor={`${id}-cep`} className="label">
            CEP <span className="font-normal text-mute">(para calcular o envio depois)</span>
          </label>
          <div className="relative">
            <input
              {...fieldProps("cep")}
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="00000-000"
              className="field"
              {...register("cep", {
                onChange: (e) => {
                  const v = maskCep(e.target.value);
                  setValue("cep", v);
                  if (v.length === 9) void lookupCep(v);
                },
              })}
            />
            {cepState === "loading" && <Loader2 className="absolute top-1/2 right-4 size-4 -translate-y-1/2 animate-spin text-mute" aria-hidden />}
          </div>
          {errorText("cep")}
          {cepState === "error" && <p className="mt-1.5 text-xs text-mute">Não encontramos este CEP — preencha a cidade manualmente.</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-city`} className="label">
            Cidade <span className="text-magenta">*</span>
          </label>
          <input {...fieldProps("city")} autoComplete="address-level2" placeholder="Ex.: Guarujá - SP" className="field" {...register("city")} />
          {errorText("city")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-notes`} className="label">
            Observações
          </label>
          <textarea {...fieldProps("notes")} rows={4} maxLength={1500} placeholder="Prazo desejado, cores, referências, local de instalação…" className="field resize-y" {...register("notes")} />
        </div>
        <label className="flex cursor-pointer items-start gap-3 sm:col-span-2">
          <input type="checkbox" className="mt-1 size-5 shrink-0 accent-cyan" {...register("needsDesign")} />
          <span className="text-sm text-white/80">Preciso de criação ou ajuste de arte</span>
        </label>
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" className="mt-1 size-5 shrink-0 accent-cyan" aria-invalid={Boolean(err("consent"))} {...register("consent")} />
            <span className="text-sm text-white/80">
              Concordo em enviar estes dados à Guaru Print para receber o orçamento, conforme a{" "}
              <Link href="/politica-de-privacidade" target="_blank" className="underline underline-offset-4">
                Política de Privacidade
              </Link>
              . <span className="text-magenta">*</span>
            </span>
          </label>
          {errorText("consent")}
        </div>
      </div>

      <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={onBack} className="min-h-12 rounded-full px-5 text-sm font-semibold text-mute hover:text-paper">
          Voltar
        </button>
        <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-paper px-6 font-sub font-semibold text-ink transition hover:bg-cyan">
          Revisar pedido <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </form>
  );
}
