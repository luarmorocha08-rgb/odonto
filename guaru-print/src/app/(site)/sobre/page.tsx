import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { Differentials } from "@/components/sections/Differentials";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { siteConfig } from "@/config/site";
import { getSettings } from "@/lib/data/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Sobre a Guaru Print",
  description: "Gráfica rápida e comunicação visual em Guarujá/SP, com mais de 20.000 pedidos entregues e envio para todo o Brasil.",
  path: "/sobre",
});

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader
        eyebrow="Sobre nós"
        title={
          <>
            {siteConfig.yearsActive} anos transformando ideias <span className="text-cmyk">em impressão.</span>
          </>
        }
        crumbs={[{ name: "Sobre", path: "/sobre" }]}
      />
      <section className="pb-10" aria-label="Apresentação">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-5 text-lg leading-relaxed text-white/75">
            {settings.aboutText ? (
              settings.aboutText.split(/\n{2,}/).map((p) => <p key={p.slice(0, 20)}>{p}</p>)
            ) : (
              <>
                <p>
                  A <strong className="text-paper">Guaru Print</strong> é uma gráfica rápida e de comunicação visual de <strong className="text-paper">Guarujá, no litoral de São Paulo</strong>. Produzimos adesivos, banners, cavaletes, fachadas, letreiros, luminosos, panfletos, impressos e sinalização.
                </p>
                <p>
                  São <strong className="text-paper">{siteConfig.highlights.ordersDelivered} pedidos entregues</strong> e envios para <strong className="text-paper">todo o Brasil</strong>. Do arquivo à entrega, cuidamos para que a sua marca seja vista do jeito que ela merece.
                </p>
              </>
            )}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button href="/servicos" icon={<ArrowRight className="size-4" aria-hidden />}>
                Ver serviços
              </Button>
              <Button href={siteConfig.instagram.url} external variant="ghost" ink="white">
                {settings.instagramHandle}
              </Button>
            </div>
          </div>
          <div aria-hidden className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 bg-ink-2">
            <div className="halftone absolute inset-0" />
            <div className="absolute top-[18%] left-[16%] size-[46%] rounded-full bg-cyan mix-blend-screen" />
            <div className="absolute top-[18%] right-[16%] size-[46%] rounded-full bg-magenta mix-blend-screen" />
            <div className="absolute bottom-[12%] left-1/2 size-[46%] -translate-x-1/2 rounded-full bg-yellow mix-blend-screen" />
            <p className="absolute right-6 bottom-6 font-display text-6xl font-extrabold tracking-[-0.06em] text-white/90 italic">CMYK</p>
          </div>
        </div>
      </section>
      <Differentials />
      <HowItWorks />
      <CtaBand />
    </>
  );
}
