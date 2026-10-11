import Image from "next/image";
import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";
import { Illustration } from "./Illustration";

/** Foto do projeto ou, enquanto não houver, a ilustração com selo de exemplo. */
export function ProjectVisual({ project, className, sizes = "(min-width: 1024px) 40vw, 90vw", priority }: { project: Project; className?: string; sizes?: string; priority?: boolean }) {
  const src = project.images[0];
  return (
    <div className={cn("relative overflow-hidden bg-ink-3", className)}>
      {src ? (
        <Image src={src} alt={`${project.title} — ${project.description.slice(0, 90)}`} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <Illustration kind={project.illustration} accent={project.accent} title={`Ilustração: ${project.title}`} />
      )}
      {project.placeholder && (
        <span className="demo-badge absolute top-3 left-3 backdrop-blur">Exemplo ilustrativo</span>
      )}
    </div>
  );
}
