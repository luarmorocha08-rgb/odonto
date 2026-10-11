import type { Metadata } from "next";
import { Suspense } from "react";
import { CtaBand } from "@/components/sections/CtaBand";
import { PortfolioGallery } from "@/components/sections/PortfolioGallery";
import { PageHeader } from "@/components/ui/PageHeader";
import { getProjects } from "@/lib/data/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Portfólio de comunicação visual",
  description: "Fachadas, adesivos, luminosos, impressos e sinalização produzidos pela Guaru Print em Guarujá/SP.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const projects = await getProjects();
  const hasPlaceholders = projects.some((p) => p.placeholder);
  return (
    <>
      <PageHeader
        eyebrow="Portfólio"
        title={
          <>
            Trabalhos que <span className="text-cmyk">chamam atenção.</span>
          </>
        }
        description="Filtre por categoria e clique em um projeto para ver detalhes, materiais e pedir algo semelhante."
        crumbs={[{ name: "Portfólio", path: "/portfolio" }]}
      >
        {hasPlaceholders && (
          <p className="mt-6 max-w-2xl rounded-2xl border border-yellow/30 bg-yellow/5 px-5 py-4 text-sm text-white/75">
            Itens marcados como <strong className="text-yellow">exemplo ilustrativo</strong> são espaços reservados e não representam clientes reais. Eles serão substituídos pelas fotos oficiais dos trabalhos.
          </p>
        )}
      </PageHeader>
      <section className="pb-24" aria-label="Projetos">
        <div className="container-x">
          <Suspense>
            <PortfolioGallery projects={projects} />
          </Suspense>
        </div>
      </section>
      <CtaBand title="Seu projeto pode ser o próximo." />
    </>
  );
}
