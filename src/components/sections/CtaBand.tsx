import { Pearl } from "@/components/three/Pearl";
import { WhatsAppCta } from "@/components/ui/CtaLink";

/** Faixa de conversão entre a galeria e a jornada do paciente. */
export function CtaBand() {
  return (
    <section aria-labelledby="cta-title" data-tone="taupe" className="relative overflow-hidden py-24 md:py-32">
      <div className="container-lux grid items-center gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="eyebrow mb-5 text-ink/70">Agende sua avaliação</p>
          <h2
            id="cta-title"
            data-reveal="lines"
            className="font-display text-headline font-extralight tracking-[-0.03em] text-balance"
          >
            Cuidar de você começa com <em className="font-light italic">uma boa conversa.</em>
          </h2>
          <div data-reveal="fade" className="mt-10 flex flex-wrap gap-3">
            <WhatsAppCta location="cta-band">Agendar minha avaliação</WhatsAppCta>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[420px] md:col-span-5">
          <Pearl />
        </div>
      </div>
    </section>
  );
}
