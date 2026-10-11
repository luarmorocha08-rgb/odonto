"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trackEvent } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/whatsapp";

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(120),
  subject: z.enum(["orcamento", "duvida", "arte", "outro"]),
  message: z.string().trim().min(5, "Escreva sua mensagem").max(1200),
});
type Values = z.infer<typeof schema>;

const SUBJECTS: Record<Values["subject"], string> = { orcamento: "Orçamento", duvida: "Dúvida", arte: "Arte / arquivo", outro: "Outro assunto" };

/** Formulário de contato → abre o WhatsApp com a mensagem (sem armazenar dados). */
export function ContactForm() {
  const id = useId();
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { subject: "orcamento" } });

  const onSubmit = handleSubmit((v) => {
    trackEvent("form_submit", { location: "contact" });
    trackEvent("whatsapp_click", { location: "contact-form" });
    const text = `Olá, Guaru Print! Meu nome é ${v.name}.\n*Assunto:* ${SUBJECTS[v.subject]}\n\n${v.message}`;
    const url = whatsappUrl(text);
    setSentUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  });

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 md:p-8">
      <div>
        <label htmlFor={`${id}-n`} className="label">
          Nome
        </label>
        <input id={`${id}-n`} autoComplete="name" className="field" aria-invalid={Boolean(errors.name)} {...register("name")} />
        {errors.name && <p className="mt-1.5 text-sm text-magenta">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor={`${id}-s`} className="label">
          Assunto
        </label>
        <select id={`${id}-s`} className="field" {...register("subject")}>
          {Object.entries(SUBJECTS).map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`${id}-m`} className="label">
          Mensagem
        </label>
        <textarea id={`${id}-m`} rows={5} className="field resize-y" aria-invalid={Boolean(errors.message)} {...register("message")} />
        {errors.message && <p className="mt-1.5 text-sm text-magenta">{errors.message.message}</p>}
      </div>
      <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] font-sub font-semibold text-ink hover:brightness-110">
        <Send className="size-4" aria-hidden /> Enviar pelo WhatsApp
      </button>
      {sentUrl && (
        <p className="text-sm text-white/75" role="status">
          O WhatsApp não abriu?{" "}
          <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="text-[#25D366] underline underline-offset-4">
            Toque aqui para abrir a conversa
          </a>
          .
        </p>
      )}
      <p className="text-xs text-mute">Sua mensagem é enviada direto para o WhatsApp da Guaru Print. O site não armazena estes dados.</p>
    </form>
  );
}
