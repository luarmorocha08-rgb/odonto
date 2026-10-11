import { faq } from "@/content/faq";
import { Accordion } from "@/components/ui/Accordion";
import { WhatsAppCta } from "@/components/ui/CtaLink";
import { faqJsonLd, JsonLd } from "@/lib/seo";

export function Faq() {
  return (
    <section id="duvidas" aria-labelledby="duvidas-title" data-tone="offwhite" className="relative py-28 md:py-40">
      <JsonLd data={faqJsonLd(faq)} />
      <div className="container-lux grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-5 flex items-center gap-3 text-taupe-deep">
            <span className="h-px w-10 bg-current" />
            Dúvidas frequentes
          </p>
          <h2
            id="duvidas-title"
            data-reveal="lines"
            className="font-display text-headline font-extralight tracking-[-0.03em] text-balance"
          >
            Ficou com <em className="font-light text-taupe-deep italic">alguma dúvida?</em>
          </h2>
          <p data-reveal="fade" className="mt-6 max-w-xs text-sm leading-relaxed text-ink/70">
            Se a sua pergunta não estiver aqui, fale com a equipe pelo WhatsApp.
          </p>
          <div data-reveal="fade" className="mt-8">
            <WhatsAppCta location="faq" variant="outline">
              Conversar pelo WhatsApp
            </WhatsAppCta>
          </div>
        </div>
        <div data-reveal="fade" className="lg:col-span-7 lg:col-start-6">
          <Accordion items={faq} />
        </div>
      </div>
    </section>
  );
}
