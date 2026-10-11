import Image from "next/image";
import type { MediaAsset } from "@/content/types";
import { cn } from "@/lib/cn";
import { ArtPlaceholder } from "./ArtPlaceholder";

type Props = {
  asset: MediaAsset;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  tone?: "light" | "deep";
  /** Exibe a etiqueta "Imagem provisória" na arte substituta. */
  showLabel?: boolean;
};

/**
 * Exibe a fotografia configurada ou, na ausência dela, a arte provisória.
 * O elemento pai deve definir o tamanho (o conteúdo é posicionado com `fill`).
 */
export function Media({ asset, sizes, priority, className, imgClassName, tone, showLabel }: Props) {
  if (!asset.src) {
    return <ArtPlaceholder variant={asset.art} className={className} tone={tone} showLabel={showLabel} />;
  }
  return (
    <Image
      src={asset.src}
      alt={asset.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className, imgClassName)}
    />
  );
}
