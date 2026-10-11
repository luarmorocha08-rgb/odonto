/**
 * Informações comerciais da Guaru Print.
 *
 * Tudo o que aparece aqui foi confirmado pelo perfil oficial (@grafica.guaruprint).
 * Campos marcados como `null` ainda aguardam confirmação da empresa e ficam
 * ocultos no site até serem preenchidos — não invente dados.
 * Quando o Supabase estiver configurado, o painel pode sobrescrever estes
 * valores (entidade "settings").
 */
const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5513992095305").replace(/\D/g, "");

export const siteConfig = {
  name: "Guaru Print",
  legalName: "Guaru Print | Gráfica Rápida",
  shortDescription: "Gráfica rápida e comunicação visual em Guarujá/SP",
  description:
    "Guaru Print: gráfica rápida e comunicação visual em Guarujá/SP. Adesivos personalizados, banners, cavaletes, fachadas, letreiros, luminosos, panfletos, impressos e sinalização, com envio para todo o Brasil.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.guaruprint.com.br").replace(/\/$/, ""),
  locale: "pt_BR",
  city: "Guarujá",
  state: "SP",
  country: "BR",
  /** Endereço completo ainda não informado — exibimos apenas a cidade. */
  streetAddress: null as string | null,
  postalCode: null as string | null,
  openingHours: null as string | null,
  email: null as string | null,
  yearsActive: 7,
  /** Números exibidos no perfil oficial. */
  highlights: {
    ordersDelivered: "20.000+",
    shipsNationwide: true,
  },
  whatsapp: {
    number: whatsappNumber,
    display: "(13) 99209-5305",
  },
  instagram: {
    handle: "@grafica.guaruprint",
    url: "https://www.instagram.com/grafica.guaruprint/",
  },
  analytics: {
    ga4Id: process.env.NEXT_PUBLIC_GA4_ID || null,
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || null,
  },
  messages: {
    general: "Olá, Guaru Print! Vim pelo site e gostaria de solicitar um orçamento.",
    service: (name: string) => `Olá, Guaru Print! Vim pelo site e gostaria de um orçamento de ${name}.`,
    expert: "Olá, Guaru Print! Vim pelo site e gostaria de falar com um especialista para escolher o melhor material.",
    help: "Olá, Guaru Print! Vim pelo site e tenho uma dúvida.",
    project: (title: string) => `Olá, Guaru Print! Vi o projeto "${title}" no site e gostaria de algo semelhante.`,
  },
} as const;

export type SiteConfig = typeof siteConfig;

export const mainNav = [
  { href: "/servicos", label: "Serviços" },
  { href: "/portfolio", label: "Portfólio" },
  { href: "/simulador", label: "Simulador" },
  { href: "/guia-de-impressao", label: "Guia de impressão" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
] as const;
