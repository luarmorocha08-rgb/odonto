import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BeforeAfter, FacadeDrawing } from "@/components/tools/BeforeAfter";
import { projectCategories } from "@/content/projects";
import type { Project } from "@/content/types";

/**
 * Antes e depois arrastável. Usa um projeto real do painel quando houver fotos
 * de antes/depois; caso contrário, uma ilustração identificada como exemplo.
 */
export function BeforeAfterSection({ project }: { project: Project | null }) {
  const real = project?.beforeImage && project.afterImage ? project : null;
  const category = real ? projectCategories.find((c) => c.key === real.category)?.label : "Fachadas";
  return (
    <section className="relative py-28 md:py-36" aria-labelledby="ba-title">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.4fr_0.8fr]">
        <BeforeAfter
          label={real?.title ?? "Fachada ilustrativa"}
          before={real?.beforeImage ?? <FacadeDrawing stage="before" />}
          after={real?.afterImage ?? <FacadeDrawing stage="after" />}
        />
        <div>
          <p className="eyebrow">Compare</p>
          <h2 id="ba-title" data-split="lines" className="display-lg mt-5">
            Arraste e veja a diferença.
          </h2>
          <dl className="mt-8 space-y-3 text-sm">
            <div className="flex gap-3">
              <dt className="w-24 text-mute">Projeto</dt>
              <dd>{real?.title ?? "Fachada com placa, adesivos e iluminação"}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 text-mute">Categoria</dt>
              <dd>{category}</dd>
            </div>
          </dl>
          {!real && <p className="demo-badge mt-6">Exemplo ilustrativo — não é um projeto real</p>}
          <div className="mt-8">
            <Button href="/orcamento?produto=fachada" icon={<ArrowRight className="size-4" aria-hidden />} track={{ name: "quote_start", params: { location: "before-after" } }}>
              Quero transformar minha fachada
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
