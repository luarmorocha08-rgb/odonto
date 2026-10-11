export type Accent = "cyan" | "magenta" | "yellow";

export type ProductKey =
  | "adesivo"
  | "banner"
  | "fachada"
  | "cavalete"
  | "panfleto"
  | "luminoso"
  | "placa"
  | "impresso"
  | "outro";

export type IllustrationKey =
  | "sticker"
  | "banner"
  | "easel"
  | "facade"
  | "lightbox"
  | "flyer"
  | "prints"
  | "signage";

export type Service = {
  slug: string;
  name: string;
  /** Frase curta para cards. */
  tagline: string;
  description: string;
  applications: string[];
  customization: string[];
  /** Pontos a definir no orçamento — não são especificações técnicas fechadas. */
  specs: { label: string; value: string }[];
  /** Termos usados pela busca inteligente. */
  keywords: string[];
  accent: Accent;
  illustration: IllustrationKey;
  /** Produto pré-selecionado no orçamento. */
  quoteProduct: ProductKey;
  /** URL de imagem real (painel). Sem ela, usamos a ilustração vetorial. */
  image?: string | null;
  order: number;
};

export type ProjectCategory = "fachadas" | "adesivos" | "luminosos" | "impressos" | "sinalizacao";

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;
  materials?: string[];
  images: string[];
  beforeImage?: string | null;
  afterImage?: string | null;
  /** Placeholder demonstrativo — exibe o selo "Exemplo ilustrativo". */
  placeholder: boolean;
  accent: Accent;
  illustration: IllustrationKey;
  order: number;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  /** Resposta ainda depende de confirmação da empresa. */
  pending?: boolean;
  order: number;
};
