"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { siteConfig } from "@/config/site";
import type { Service } from "@/content/types";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { whatsappUrl } from "@/lib/whatsapp";

/** Botão flutuante com mensagem de acordo com a página/serviço visualizado. */
export function WhatsAppFloat({ services }: { services: Pick<Service, "slug" | "name">[] }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 280);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const slug = pathname.match(/^\/servicos\/([^/]+)/)?.[1];
  const service = slug ? services.find((s) => s.slug === slug) : undefined;
  const message = service
    ? siteConfig.messages.service(service.name.toLowerCase())
    : pathname.startsWith("/simulador")
      ? "Olá, Guaru Print! Estou usando o simulador do site e gostaria de ajuda com a minha arte."
      : pathname.startsWith("/guia-de-impressao")
        ? "Olá, Guaru Print! Estou preparando meu arquivo para impressão e tenho uma dúvida."
        : siteConfig.messages.general;

  const show = visible || pathname !== "/";

  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click", { location: "float", service: service?.slug })}
      aria-label="Conversar no WhatsApp (abre em nova aba)"
      className={cn(
        "group fixed right-4 bottom-4 z-[45] flex h-14 items-center gap-0 rounded-full bg-[#25D366] pr-4 pl-4 text-ink shadow-[0_18px_40px_-12px_rgba(37,211,102,0.55)] transition-all duration-500 md:right-6 md:bottom-6",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <WhatsAppIcon className="size-6 shrink-0" />
      <span className="max-w-0 overflow-hidden font-sub text-sm font-semibold whitespace-nowrap transition-[max-width,margin] duration-500 group-hover:ml-2 group-hover:max-w-48 group-focus-visible:ml-2 group-focus-visible:max-w-48">
        {service ? `Orçar ${service.name.toLowerCase()}` : "Fale com a gente"}
      </span>
    </a>
  );
}
