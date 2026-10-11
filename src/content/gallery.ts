/**
 * Galeria de resultados.
 *
 * ⚠️ Publique APENAS imagens reais, com consentimento por escrito do paciente
 * e após revisão das normas de publicidade odontológica do CFO/CRO.
 * Nenhuma imagem foi incluída por padrão.
 *
 * Exemplo:
 * {
 *   id: "clareamento-01",
 *   treatment: "clareamento-dental",
 *   src: "/images/resultados/clareamento-01.jpg",
 *   alt: "Registro clínico de clareamento dental",
 *   caption: "Clareamento dental — protocolo em consultório.",
 *   consentOnFile: true,
 * }
 */
export type GalleryItem = {
  id: string;
  /** slug do tratamento (ver content/treatments.ts) */
  treatment: string;
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  /** Confirma que existe termo de consentimento assinado arquivado na clínica. */
  consentOnFile: true;
};

export const gallery: GalleryItem[] = [];
