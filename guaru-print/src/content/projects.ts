import type { Project, ProjectCategory } from "./types";

export const projectCategories: { key: ProjectCategory | "todos"; label: string }[] = [
  { key: "todos", label: "Todos os projetos" },
  { key: "fachadas", label: "Fachadas" },
  { key: "adesivos", label: "Adesivos" },
  { key: "luminosos", label: "Luminosos" },
  { key: "impressos", label: "Impressos" },
  { key: "sinalizacao", label: "Sinalização" },
];

/**
 * PLACEHOLDERS DEMONSTRATIVOS.
 * Não representam clientes nem trabalhos reais. Substitua pelo painel (/admin)
 * com fotos oficiais — cada item exibe o selo "Exemplo ilustrativo" enquanto
 * `placeholder` for verdadeiro.
 */
export const projects: Project[] = [
  {
    slug: "exemplo-fachada-acm-letras-caixa",
    title: "Fachada em ACM com letras-caixa",
    category: "fachadas",
    description:
      "Exemplo ilustrativo de como apresentaremos um projeto de fachada: placa em ACM, letras-caixa e iluminação. A foto oficial será adicionada pelo painel.",
    materials: ["ACM", "Letras-caixa", "Iluminação"],
    images: [],
    placeholder: true,
    accent: "cyan",
    illustration: "facade",
    order: 1,
  },
  {
    slug: "exemplo-adesivacao-vitrine",
    title: "Adesivação de vitrine",
    category: "adesivos",
    description:
      "Exemplo ilustrativo de adesivação de vitrine com vinil impresso e recortado. Espaço reservado para um trabalho real.",
    materials: ["Vinil impresso", "Vinil recortado"],
    images: [],
    placeholder: true,
    accent: "magenta",
    illustration: "sticker",
    order: 2,
  },
  {
    slug: "exemplo-letreiro-luminoso",
    title: "Letreiro luminoso interno",
    category: "luminosos",
    description: "Exemplo ilustrativo de letreiro iluminado para recepção. Espaço reservado para um trabalho real.",
    materials: ["Acrílico", "Iluminação"],
    images: [],
    placeholder: true,
    accent: "magenta",
    illustration: "lightbox",
    order: 3,
  },
  {
    slug: "exemplo-kit-impressos",
    title: "Kit de impressos da marca",
    category: "impressos",
    description:
      "Exemplo ilustrativo de cartões, panfletos e tags com a mesma identidade visual. Espaço reservado para um trabalho real.",
    materials: ["Papel couché", "Laminação"],
    images: [],
    placeholder: true,
    accent: "yellow",
    illustration: "prints",
    order: 4,
  },
  {
    slug: "exemplo-sinalizacao-interna",
    title: "Sinalização interna",
    category: "sinalizacao",
    description: "Exemplo ilustrativo de placas de identificação e orientação. Espaço reservado para um trabalho real.",
    materials: ["PVC", "Adesivo"],
    images: [],
    placeholder: true,
    accent: "yellow",
    illustration: "signage",
    order: 5,
  },
  {
    slug: "exemplo-banner-evento",
    title: "Banner para evento",
    category: "impressos",
    description: "Exemplo ilustrativo de banner com ilhós para evento. Espaço reservado para um trabalho real.",
    materials: ["Lona", "Ilhós"],
    images: [],
    placeholder: true,
    accent: "cyan",
    illustration: "banner",
    order: 6,
  },
];
