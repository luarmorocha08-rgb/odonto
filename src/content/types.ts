/** Estilos da arte provisória exibida enquanto não houver fotografia oficial. */
export type ArtVariant = "portrait" | "profile" | "smile" | "lips" | "arch" | "clinic";

export type MediaAsset = {
  /** Caminho da foto (ex.: "/images/hero.jpg"). `null` exibe a arte provisória. */
  src: string | null;
  alt: string;
  art?: ArtVariant;
};
