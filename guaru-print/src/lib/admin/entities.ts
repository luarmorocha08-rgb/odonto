import { z } from "zod";
import { PRODUCT_KEYS } from "@/lib/quote/products";

/**
 * Entidades administráveis. Cada uma define:
 * - `schema`: validação (usada no painel e ao ler do banco);
 * - `fields`: como o formulário do painel é desenhado.
 */
export type AdminField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "list" | "number" | "select" | "boolean" | "image" | "images" | "pairs";
  options?: string[];
  hint?: string;
  required?: boolean;
};

const lines = z.array(z.string().trim().min(1).max(300)).max(40);
const accent = z.enum(["cyan", "magenta", "yellow"]);
const illustration = z.enum(["sticker", "banner", "easel", "facade", "lightbox", "flyer", "prints", "signage"]);
const url = z.union([z.literal(""), z.string().url().max(600)]).nullish();
const slug = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use letras minúsculas, números e hífens");

export const serviceSchema = z.object({
  slug,
  name: z.string().trim().min(2).max(80),
  tagline: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(2000),
  applications: lines,
  customization: lines,
  specs: z.array(z.object({ label: z.string().max(60), value: z.string().max(200) })).max(20),
  keywords: lines,
  accent,
  illustration,
  quoteProduct: z.enum(PRODUCT_KEYS),
  image: url,
  order: z.coerce.number().int().min(0).max(999),
});

export const projectSchema = z.object({
  slug,
  title: z.string().trim().min(2).max(120),
  category: z.enum(["fachadas", "adesivos", "luminosos", "impressos", "sinalizacao"]),
  description: z.string().trim().min(10).max(2000),
  materials: lines.optional(),
  images: z.array(z.string().url().max(600)).max(12),
  beforeImage: url,
  afterImage: url,
  placeholder: z.boolean(),
  accent,
  illustration,
  order: z.coerce.number().int().min(0).max(999),
});

export const faqSchema = z.object({
  id: slug,
  question: z.string().trim().min(5).max(200),
  answer: z.string().trim().min(5).max(2000),
  pending: z.boolean().optional(),
  order: z.coerce.number().int().min(0).max(999),
});

export const settingsSchema = z.object({
  whatsappDisplay: z.string().trim().max(40),
  instagramHandle: z.string().trim().max(60),
  streetAddress: z.string().trim().max(200).optional(),
  postalCode: z.string().trim().max(12).optional(),
  openingHours: z.string().trim().max(200).optional(),
  email: z.union([z.literal(""), z.email()]).optional(),
  aboutText: z.string().trim().max(4000).optional(),
});

export type Settings = z.infer<typeof settingsSchema>;

const productOptions = [...PRODUCT_KEYS];

export const ENTITIES = {
  service: {
    label: "Serviços",
    singular: "serviço",
    keyField: "slug",
    titleField: "name",
    schema: serviceSchema,
    fields: [
      { name: "slug", label: "Endereço (slug)", type: "text", required: true, hint: "ex.: adesivos-personalizados" },
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "tagline", label: "Frase curta", type: "text", required: true },
      { name: "description", label: "Descrição", type: "textarea", required: true },
      { name: "applications", label: "Aplicações comuns", type: "list", hint: "Uma por linha" },
      { name: "customization", label: "Opções de personalização", type: "list", hint: "Uma por linha" },
      { name: "specs", label: "Especificações", type: "pairs", hint: "Uma por linha no formato Rótulo: valor" },
      { name: "keywords", label: "Palavras para a busca", type: "list", hint: "Uma por linha" },
      { name: "image", label: "Imagem", type: "image" },
      { name: "accent", label: "Cor de destaque", type: "select", options: ["cyan", "magenta", "yellow"] },
      {
        name: "illustration",
        label: "Ilustração (quando não houver foto)",
        type: "select",
        options: ["sticker", "banner", "easel", "facade", "lightbox", "flyer", "prints", "signage"],
      },
      { name: "quoteProduct", label: "Produto no orçamento", type: "select", options: productOptions },
      { name: "order", label: "Ordem", type: "number" },
    ],
  },
  project: {
    label: "Projetos",
    singular: "projeto",
    keyField: "slug",
    titleField: "title",
    schema: projectSchema,
    fields: [
      { name: "slug", label: "Endereço (slug)", type: "text", required: true },
      { name: "title", label: "Título", type: "text", required: true },
      {
        name: "category",
        label: "Categoria",
        type: "select",
        options: ["fachadas", "adesivos", "luminosos", "impressos", "sinalizacao"],
      },
      { name: "description", label: "Descrição", type: "textarea", required: true },
      { name: "materials", label: "Materiais utilizados", type: "list", hint: "Um por linha" },
      { name: "images", label: "Fotos", type: "images" },
      { name: "beforeImage", label: "Foto do antes", type: "image" },
      { name: "afterImage", label: "Foto do depois", type: "image" },
      { name: "placeholder", label: "Exemplo ilustrativo (não é projeto real)", type: "boolean" },
      { name: "accent", label: "Cor de destaque", type: "select", options: ["cyan", "magenta", "yellow"] },
      {
        name: "illustration",
        label: "Ilustração (sem foto)",
        type: "select",
        options: ["sticker", "banner", "easel", "facade", "lightbox", "flyer", "prints", "signage"],
      },
      { name: "order", label: "Ordem", type: "number" },
    ],
  },
  faq: {
    label: "Perguntas frequentes",
    singular: "pergunta",
    keyField: "id",
    titleField: "question",
    schema: faqSchema,
    fields: [
      { name: "id", label: "Identificador", type: "text", required: true },
      { name: "question", label: "Pergunta", type: "text", required: true },
      { name: "answer", label: "Resposta", type: "textarea", required: true },
      { name: "pending", label: "Aguardando confirmação da empresa", type: "boolean" },
      { name: "order", label: "Ordem", type: "number" },
    ],
  },
  settings: {
    label: "Informações comerciais",
    singular: "informações",
    keyField: null,
    titleField: null,
    schema: settingsSchema,
    fields: [
      { name: "whatsappDisplay", label: "WhatsApp (exibição)", type: "text", hint: "O número usado nos links fica em NEXT_PUBLIC_WHATSAPP_NUMBER" },
      { name: "instagramHandle", label: "Instagram", type: "text" },
      { name: "streetAddress", label: "Endereço", type: "text" },
      { name: "postalCode", label: "CEP", type: "text" },
      { name: "openingHours", label: "Horário de funcionamento", type: "text" },
      { name: "email", label: "E-mail", type: "text" },
      { name: "aboutText", label: "Texto da página Sobre", type: "textarea" },
    ],
  },
} as const satisfies Record<string, { label: string; singular: string; keyField: string | null; titleField: string | null; schema: z.ZodType; fields: AdminField[] }>;

export type EntityKey = keyof typeof ENTITIES;
export const ENTITY_KEYS = Object.keys(ENTITIES) as EntityKey[];
export const isEntityKey = (v: string): v is EntityKey => v in ENTITIES;
