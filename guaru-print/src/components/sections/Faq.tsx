import { HelpCircle } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/config/site";
import type { FaqItem } from "@/content/types";
import { faqJsonLd, JsonLd } from "@/lib/seo";

/** Central de ajuda (FAQ) — perguntas editáveis pelo painel. */
export function Faq({ items, title = "Central de ajuda" }: { items: FaqItem[]; title?: string }) {
  return (
    <section id="ajuda" className="relative py-28 md:py-36" aria-labelledby="faq-title">
      <JsonLd data={faqJsonLd(items)} />
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">Dúvidas frequentes</p>
          <h2 id="faq-title" data-split="lines" className="display-lg mt-5">
            {title}
          </h2>
          <p className="mt-5 max-w-sm text-white/65">Não encontrou o que procura? Nossa equipe responde pelo WhatsApp.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <WhatsAppButton location="faq" label="Tirar uma dúvida" message={siteConfig.messages.help} />
            <span className="inline-flex items-center gap-2 text-sm text-mute">
              <HelpCircle className="size-4" aria-hidden /> Atendimento humano
            </span>
          </div>
        </div>
        <Accordion items={items} />
      </div>
    </section>
  );
}
