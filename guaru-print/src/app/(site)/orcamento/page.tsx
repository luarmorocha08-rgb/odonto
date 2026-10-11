import { Clock, MessageCircle, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteWizard } from "@/components/quote/QuoteWizard";
import { DimensionCalculator } from "@/components/tools/DimensionCalculator";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Solicitar orçamento",
  description: "Monte seu pedido de adesivos, banners, fachadas, cavaletes, panfletos, luminosos e mais. Envie sua arte e receba o orçamento pelo WhatsApp — sem cadastro.",
  path: "/orcamento",
});

export default function QuotePage() {
  return (
    <>
      <PageHeader
        eyebrow="Orçamento inteligente"
        title={
          <>
            Monte seu pedido em <span className="text-cmyk">poucos passos.</span>
          </>
        }
        description="Sem cadastro e sem senha. Escolha os produtos, informe medidas, envie sua arte e receba o retorno pelo WhatsApp."
        crumbs={[{ name: "Orçamento", path: "/orcamento" }]}
      >
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70">
          <li className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-cyan" aria-hidden /> Arquivos em armazenamento privado
          </li>
          <li className="flex items-center gap-2">
            <MessageCircle className="size-4 text-magenta" aria-hidden /> Resposta pelo WhatsApp
          </li>
          <li className="flex items-center gap-2">
            <Clock className="size-4 text-yellow" aria-hidden /> Leva cerca de 2 minutos
          </li>
        </ul>
      </PageHeader>
      <section id="formulario" className="scroll-mt-24 pb-20" aria-label="Formulário de orçamento">
        <div className="container-x">
          <Suspense fallback={<div className="card h-[32rem] animate-pulse" />}>
            <QuoteWizard />
          </Suspense>
        </div>
      </section>
      <section className="pb-28" aria-label="Calculadora de medidas">
        <div className="container-x">
          <DimensionCalculator />
        </div>
      </section>
    </>
  );
}
