import { z } from "zod";
import type { ProductKey } from "@/content/types";

/**
 * Definição declarativa dos produtos do orçamento.
 * Uma única fonte de verdade para: campos do formulário, validação (zod),
 * resumo, mensagem do WhatsApp e API. Para adicionar um produto ou um campo,
 * edite apenas este arquivo.
 *
 * Não há preços aqui. A arquitetura de preços futura fica em `pricing.ts`.
 */

export type Option = { value: string; label: string };

export type FieldDef =
  | { name: string; label: string; type: "number"; min?: number; max?: number; step?: number; required?: boolean; hint?: string; suffix?: string }
  | { name: string; label: string; type: "select"; options: Option[]; required?: boolean; hint?: string }
  | { name: string; label: string; type: "choice"; options: Option[]; required?: boolean; hint?: string }
  | { name: string; label: string; type: "text"; required?: boolean; hint?: string; placeholder?: string; maxLength?: number }
  | { name: string; label: string; type: "textarea"; required?: boolean; hint?: string; placeholder?: string; maxLength?: number }
  | { name: string; label: string; type: "toggle"; hint?: string };

export type ProductDef = {
  key: ProductKey;
  label: string;
  description: string;
  /** Usa o bloco de medidas (largura × altura + unidade). */
  dimensions: "required" | "optional" | "none";
  quantityLabel: string;
  fields: FieldDef[];
};

const NOT_SURE: Option = { value: "indicacao", label: "Não sei — quero indicação" };

const finishLamination: Option[] = [
  { value: "sem-laminacao", label: "Sem laminação" },
  { value: "laminacao-fosca", label: "Laminação fosca" },
  { value: "laminacao-brilho", label: "Laminação brilho" },
  NOT_SURE,
];

export const PRODUCTS: ProductDef[] = [
  {
    key: "adesivo",
    label: "Adesivo",
    description: "Vinil impresso ou recortado",
    dimensions: "required",
    quantityLabel: "Quantidade de adesivos",
    fields: [
      {
        name: "material",
        label: "Tipo de material",
        type: "select",
        required: true,
        options: [
          { value: "vinil-branco", label: "Vinil branco" },
          { value: "vinil-transparente", label: "Vinil transparente" },
          { value: "vinil-perfurado", label: "Vinil perfurado (vidros)" },
          { value: "jateado", label: "Jateado" },
          NOT_SURE,
        ],
      },
      { name: "acabamento", label: "Acabamento", type: "select", options: finishLamination },
      {
        name: "recorte",
        label: "Tipo de recorte",
        type: "choice",
        options: [
          { value: "reto", label: "Reto (retangular)" },
          { value: "contorno", label: "No contorno da arte" },
          { value: "meio-corte", label: "Meio-corte (cartela)" },
          NOT_SURE,
        ],
      },
      {
        name: "local",
        label: "Local de aplicação",
        type: "select",
        options: [
          { value: "vidro", label: "Vidro / vitrine" },
          { value: "parede", label: "Parede" },
          { value: "veiculo", label: "Veículo" },
          { value: "produto", label: "Produto / embalagem" },
          { value: "outro", label: "Outro" },
        ],
      },
    ],
  },
  {
    key: "banner",
    label: "Banner",
    description: "Lona para eventos e promoções",
    dimensions: "required",
    quantityLabel: "Quantidade de banners",
    fields: [
      {
        name: "material",
        label: "Material",
        type: "select",
        options: [
          { value: "lona-fosca", label: "Lona fosca" },
          { value: "lona-brilho", label: "Lona brilho" },
          NOT_SURE,
        ],
      },
      {
        name: "acabamento",
        label: "Acabamento",
        type: "choice",
        options: [
          { value: "bastao-corda", label: "Bastão e corda" },
          { value: "ilhos", label: "Ilhós" },
          { value: "bainha", label: "Bainha / solda" },
          { value: "sem-acabamento", label: "Sem acabamento" },
          NOT_SURE,
        ],
      },
      { name: "ilhos", label: "Quantidade de ilhós (se aplicável)", type: "number", min: 0, max: 200, step: 1 },
      { name: "uso", label: "Uso", type: "choice", options: [{ value: "interno", label: "Interno" }, { value: "externo", label: "Externo" }] },
    ],
  },
  {
    key: "fachada",
    label: "Fachada",
    description: "Placas, ACM, letras e iluminação",
    dimensions: "optional",
    quantityLabel: "Quantidade de fachadas",
    fields: [
      {
        name: "estabelecimento",
        label: "Tipo de estabelecimento",
        type: "text",
        placeholder: "Ex.: loja de roupas, clínica, restaurante",
        maxLength: 120,
      },
      {
        name: "material",
        label: "Material desejado",
        type: "select",
        options: [
          { value: "acm", label: "ACM" },
          { value: "lona", label: "Lona com estrutura" },
          { value: "letras-caixa", label: "Letras-caixa" },
          { value: "adesivo", label: "Adesivação" },
          NOT_SURE,
        ],
      },
      {
        name: "iluminacao",
        label: "Iluminação",
        type: "choice",
        options: [
          { value: "sem", label: "Sem iluminação" },
          { value: "com", label: "Com iluminação" },
          NOT_SURE,
        ],
      },
      { name: "instalacao", label: "Preciso de instalação", type: "toggle" },
    ],
  },
  {
    key: "cavalete",
    label: "Cavalete",
    description: "Comunicação de calçada",
    dimensions: "optional",
    quantityLabel: "Quantidade de cavaletes",
    fields: [
      {
        name: "faces",
        label: "Faces impressas",
        type: "choice",
        required: true,
        options: [
          { value: "uma", label: "Uma face" },
          { value: "duas", label: "Duas faces" },
        ],
      },
      {
        name: "tipo",
        label: "O que você precisa",
        type: "choice",
        options: [
          { value: "completo", label: "Cavalete + impressão" },
          { value: "so-impressao", label: "Só a impressão (já tenho o cavalete)" },
        ],
      },
    ],
  },
  {
    key: "panfleto",
    label: "Panfleto",
    description: "Flyers e folhetos",
    dimensions: "none",
    quantityLabel: "Quantidade de panfletos",
    fields: [
      {
        name: "formato",
        label: "Formato",
        type: "choice",
        required: true,
        options: [
          { value: "a6", label: "A6 (10,5 × 14,8 cm)" },
          { value: "a5", label: "A5 (14,8 × 21 cm)" },
          { value: "a4", label: "A4 (21 × 29,7 cm)" },
          { value: "personalizado", label: "Personalizado" },
        ],
      },
      {
        name: "impressao",
        label: "Impressão",
        type: "choice",
        options: [
          { value: "frente", label: "Só frente" },
          { value: "frente-verso", label: "Frente e verso" },
        ],
      },
      {
        name: "papel",
        label: "Papel",
        type: "select",
        options: [
          { value: "couche-90", label: "Couché 90 g" },
          { value: "couche-115", label: "Couché 115 g" },
          { value: "couche-150", label: "Couché 150 g" },
          NOT_SURE,
        ],
      },
      { name: "medidaPersonalizada", label: "Medida personalizada (se aplicável)", type: "text", placeholder: "Ex.: 10 × 20 cm", maxLength: 40 },
    ],
  },
  {
    key: "luminoso",
    label: "Luminoso",
    description: "Letreiros e letras-caixa",
    dimensions: "optional",
    quantityLabel: "Quantidade",
    fields: [
      {
        name: "tipo",
        label: "Tipo",
        type: "select",
        options: [
          { value: "letra-caixa", label: "Letras-caixa" },
          { value: "painel", label: "Painel / caixa luminosa" },
          { value: "logo", label: "Logo iluminado" },
          NOT_SURE,
        ],
      },
      {
        name: "ambiente",
        label: "Ambiente",
        type: "choice",
        options: [
          { value: "interno", label: "Interno" },
          { value: "externo", label: "Externo" },
        ],
      },
      { name: "instalacao", label: "Preciso de instalação", type: "toggle" },
    ],
  },
  {
    key: "placa",
    label: "Placa / sinalização",
    description: "Identificação e avisos",
    dimensions: "required",
    quantityLabel: "Quantidade de placas",
    fields: [
      {
        name: "material",
        label: "Material",
        type: "select",
        options: [
          { value: "pvc", label: "PVC" },
          { value: "acm", label: "ACM" },
          { value: "acrilico", label: "Acrílico" },
          { value: "adesivo", label: "Adesivo" },
          NOT_SURE,
        ],
      },
      {
        name: "ambiente",
        label: "Ambiente",
        type: "choice",
        options: [
          { value: "interno", label: "Interno" },
          { value: "externo", label: "Externo" },
        ],
      },
      { name: "fixacao", label: "Preciso de itens de fixação", type: "toggle" },
    ],
  },
  {
    key: "impresso",
    label: "Impresso",
    description: "Cartões, tags e papelaria",
    dimensions: "optional",
    quantityLabel: "Quantidade",
    fields: [
      {
        name: "tipo",
        label: "Produto",
        type: "select",
        required: true,
        options: [
          { value: "cartao-visita", label: "Cartão de visita" },
          { value: "tag", label: "Tag / etiqueta" },
          { value: "cardapio", label: "Cardápio" },
          { value: "receituario", label: "Receituário / bloco" },
          { value: "convite", label: "Convite" },
          { value: "outro", label: "Outro" },
        ],
      },
      { name: "acabamento", label: "Acabamento", type: "select", options: finishLamination },
    ],
  },
  {
    key: "outro",
    label: "Outro produto",
    description: "Conte o que você precisa",
    dimensions: "optional",
    quantityLabel: "Quantidade",
    fields: [
      {
        name: "descricao",
        label: "Descreva o produto",
        type: "textarea",
        required: true,
        placeholder: "Ex.: 50 bandeirolas para festa, adesivo para moto…",
        maxLength: 600,
      },
    ],
  },
];

export const PRODUCT_MAP = Object.fromEntries(PRODUCTS.map((p) => [p.key, p])) as Record<ProductKey, ProductDef>;
export const PRODUCT_KEYS = PRODUCTS.map((p) => p.key) as [ProductKey, ...ProductKey[]];

export function isProductKey(value: unknown): value is ProductKey {
  return typeof value === "string" && value in PRODUCT_MAP;
}

/** Rótulo legível de um valor de campo. */
export function formatFieldValue(field: FieldDef, value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (field.type === "toggle") return value ? "Sim" : null;
  if (field.type === "select" || field.type === "choice") {
    return field.options.find((o) => o.value === value)?.label ?? String(value);
  }
  if (field.type === "number") return String(value);
  return String(value).trim() || null;
}

// ─── Validação ──────────────────────────────────────────────────────────────

export const unitSchema = z.enum(["mm", "cm", "m"]);

const positive = (label: string) =>
  z.coerce.number({ error: `Informe ${label}` }).positive(`${label[0].toUpperCase()}${label.slice(1)} deve ser maior que zero`).max(100000, "Valor muito alto");

function fieldSchema(field: FieldDef) {
  switch (field.type) {
    case "number": {
      const base = z.coerce.number().min(field.min ?? 0).max(field.max ?? 1_000_000);
      return field.required ? base : z.union([z.literal(""), base]).optional();
    }
    case "select":
    case "choice": {
      const values = field.options.map((o) => o.value) as [string, ...string[]];
      const base = z.enum(values, { error: `Selecione ${field.label.toLowerCase()}` });
      return field.required ? base : z.union([z.literal(""), base]).optional();
    }
    case "toggle":
      return z.boolean().optional();
    case "text":
    case "textarea": {
      const base = z.string().trim().max(field.maxLength ?? 300);
      return field.required ? base.min(2, `Preencha ${field.label.toLowerCase()}`) : base.optional();
    }
  }
}

/** Schema zod de um item (produto + medidas + campos específicos). */
export function itemSchema(product: ProductKey) {
  const def = PRODUCT_MAP[product];
  const shape: Record<string, z.ZodType> = {};
  for (const field of def.fields) shape[field.name] = fieldSchema(field);

  const dims =
    def.dimensions === "required"
      ? { width: positive("a largura"), height: positive("a altura"), unit: unitSchema }
      : def.dimensions === "optional"
        ? {
            width: z.union([z.literal(""), positive("a largura")]).optional(),
            height: z.union([z.literal(""), positive("a altura")]).optional(),
            unit: unitSchema,
          }
        : {};

  return z.object({
    product: z.literal(product),
    quantity: z.coerce.number({ error: "Informe a quantidade" }).int("Use um número inteiro").min(1, "Mínimo 1").max(1_000_000),
    ...dims,
    details: z.object(shape),
  });
}

/** Valida qualquer item, escolhendo o schema pelo produto. */
export const anyItemSchema = z
  .object({ product: z.enum(PRODUCT_KEYS) })
  .passthrough()
  .transform((value, ctx) => {
    const parsed = itemSchema(value.product).safeParse(value);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) ctx.addIssue({ ...issue, code: "custom" } as never);
      return z.NEVER;
    }
    return parsed.data as QuoteItem;
  });

export type QuoteItem = {
  product: ProductKey;
  quantity: number;
  width?: number | "";
  height?: number | "";
  unit?: "mm" | "cm" | "m";
  details: Record<string, string | number | boolean | undefined>;
};

export const customerSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(120),
  whatsapp: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().min(10, "WhatsApp com DDD, ex.: (13) 99999-9999").max(13, "Número inválido")),
  email: z.union([z.literal(""), z.email("E-mail inválido").max(160)]).optional(),
  city: z.string().trim().min(2, "Informe sua cidade").max(120),
  cep: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.union([z.literal(""), z.string().length(8, "CEP com 8 dígitos")]))
    .optional(),
  notes: z.string().trim().max(1500).optional(),
  needsDesign: z.boolean().optional(),
  consent: z.literal(true, { error: "É preciso concordar para enviarmos o orçamento" }),
});

export type Customer = z.input<typeof customerSchema>;

export const quoteRequestSchema = z.object({
  items: z.array(anyItemSchema).min(1, "Adicione pelo menos um produto").max(20),
  customer: customerSchema,
  source: z.string().max(60).optional(),
});

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
