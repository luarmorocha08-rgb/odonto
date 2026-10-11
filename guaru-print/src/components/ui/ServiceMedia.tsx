import Image from "next/image";
import type { Service } from "@/content/types";
import { cn } from "@/lib/cn";
import { Illustration } from "./Illustration";

/** Imagem do serviço (painel) ou ilustração vetorial própria. */
export function ServiceMedia({ service, className, sizes = "(min-width: 1024px) 30vw, 90vw", priority }: { service: Service; className?: string; sizes?: string; priority?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {service.image ? (
        <Image src={service.image} alt={service.name} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <Illustration kind={service.illustration} accent={service.accent} title={`Ilustração: ${service.name}`} />
      )}
    </div>
  );
}
