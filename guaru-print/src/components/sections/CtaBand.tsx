import { ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/** Chamada final de conversão. */
export function CtaBand({ title = "Vamos imprimir a sua próxima ideia?", text = "Envie sua arte ou conte o que precisa. A equipe responde com valores e prazos." }: { title?: string; text?: string }) {
  return (
    <section className="relative overflow-hidden py-28 md:py-36" aria-labelledby="cta-title">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -top-1/3 left-1/4 size-[50vmax] rounded-full bg-magenta/25 blur-[140px]" />
        <div className="absolute -bottom-1/3 right-0 size-[40vmax] rounded-full bg-cyan/20 blur-[140px]" />
        <div className="halftone absolute inset-0 opacity-60" />
      </div>
      <div className="container-x text-center">
        <h2 id="cta-title" data-split="words" className="display-xl mx-auto max-w-5xl">
          {title}
        </h2>
        <p data-reveal className="mx-auto mt-6 max-w-xl font-sub text-lg text-white/70">
          {text}
        </p>
        <div data-reveal className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href="/orcamento" size="lg" icon={<ArrowRight className="size-5" aria-hidden />} track={{ name: "quote_start", params: { location: "cta-band" } }}>
            Solicitar orçamento
          </Button>
          <Button href="/orcamento#arte" size="lg" variant="ghost" ink="white" iconLeft={<Upload className="size-5" aria-hidden />}>
            Enviar minha arte
          </Button>
          <WhatsAppButton location="cta-band" label="Falar com especialista" size="lg" />
        </div>
      </div>
    </section>
  );
}
