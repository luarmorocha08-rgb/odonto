"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { treatmentWhatsappUrl, whatsappUrl } from "@/lib/whatsapp";

type Variant = "solid" | "outline" | "light" | "ghost";

const base =
  "group/cta relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full text-[0.82rem] font-medium tracking-[0.04em] transition-[color,background-color,border-color,transform] duration-500 ease-[var(--ease-luxe)] active:scale-[0.98] min-h-12 px-6";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-offwhite hover:bg-[#3a3533]",
  outline: "border border-ink/25 text-ink hover:border-ink",
  light: "bg-offwhite text-ink hover:bg-white",
  ghost: "text-ink px-0 min-h-0 rounded-none link-underline",
};

function Arrow() {
  return (
    <span
      aria-hidden
      className="relative grid size-6 place-items-center overflow-hidden rounded-full"
    >
      <ArrowUpRight
        strokeWidth={1.5}
        className="size-4 transition-transform duration-500 ease-[var(--ease-luxe)] group-hover/cta:translate-x-4 group-hover/cta:-translate-y-4"
      />
      <ArrowUpRight
        strokeWidth={1.5}
        className="absolute size-4 -translate-x-4 translate-y-4 transition-transform duration-500 ease-[var(--ease-luxe)] group-hover/cta:translate-x-0 group-hover/cta:translate-y-0"
      />
    </span>
  );
}

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
};

/** Link interno estilizado como botão. */
export function ButtonLink({
  children,
  variant = "outline",
  className,
  arrow = true,
  onClick,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(base, variants[variant], className)} onClick={onClick} {...props}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </Link>
  );
}

/**
 * Botão de agendamento pelo WhatsApp.
 * Com `treatment`, prepara a mensagem específica do procedimento.
 */
export function WhatsAppCta({
  children = "Agendar minha avaliação",
  variant = "solid",
  className,
  arrow = true,
  location,
  treatment,
}: CommonProps & { location: string; treatment?: { slug: string; name: string } } & {
  children?: ReactNode;
}) {
  const href = treatment ? treatmentWhatsappUrl(treatment.name) : whatsappUrl();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(base, variants[variant], className)}
      onClick={() => {
        trackEvent("whatsapp_click", { location, treatment: treatment?.slug, channel: "whatsapp" });
        trackEvent("schedule_click", { location, treatment: treatment?.slug });
      }}
    >
      <span>{children}</span>
      {arrow && <Arrow />}
      <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
    </a>
  );
}
