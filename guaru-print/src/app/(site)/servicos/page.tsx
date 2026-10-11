import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { ServiceCatalog } from "@/components/sections/ServiceCatalog";
import { PageHeader } from "@/components/ui/PageHeader";
import { getServices } from "@/lib/data/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Serviços de comunicação visual e impressão",
  description: "Adesivos personalizados, banners, cavaletes, fachadas comerciais, letreiros e luminosos, panfletos, impressos e sinalização em Guarujá/SP, com envio para todo o Brasil.",
  path: "/servicos",
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHeader
        eyebrow="Catálogo"
        title={
          <>
            Serviços que fazem a sua marca <span className="text-cmyk">aparecer.</span>
          </>
        }
        description="Escolha uma categoria para ver aplicações, opções de personalização e solicitar seu orçamento."
        crumbs={[{ name: "Serviços", path: "/servicos" }]}
      />
      <section className="pb-24" aria-label="Lista de serviços">
        <div className="container-x">
          <ServiceCatalog services={services} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
