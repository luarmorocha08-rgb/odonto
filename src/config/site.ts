/**
 * Configuração central da clínica.
 *
 * Todos os dados sensíveis/oficiais vêm de variáveis de ambiente (ver
 * `.env.example`). Quando um valor não está definido, o campo é ocultado no
 * site — nunca preenchemos endereço, telefone, horário ou CRO por conta própria.
 */

const env = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

/** WhatsApp oficial da clínica: (13) 99741-2905. Pode ser sobrescrito pelo .env. */
const DEFAULT_WHATSAPP = "5513997412905";
const whatsappNumber = (env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) ?? DEFAULT_WHATSAPP).replace(/\D/g, "");

const street = env(process.env.NEXT_PUBLIC_ADDRESS_STREET);
const district = env(process.env.NEXT_PUBLIC_ADDRESS_DISTRICT);
const postalCode = env(process.env.NEXT_PUBLIC_ADDRESS_POSTAL_CODE);

function formatBrPhone(digits: string) {
  const local = digits.startsWith("55") ? digits.slice(2) : digits;
  if (local.length !== 11 && local.length !== 10) return `+${digits}`;
  const split = local.length - 4;
  return `(${local.slice(0, 2)}) ${local.slice(2, split)}-${local.slice(split)}`;
}

export const siteConfig = {
  name: "J.A Odontologia Estética",
  shortName: "J.A",
  tagline: "Harmonização facial & odontologia estética",
  description:
    "Odontologia estética e harmonização facial em Santos/SP com naturalidade, equilíbrio e cuidado em cada detalhe. Agende sua avaliação pelo WhatsApp.",
  url: (env(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "pt_BR",

  whatsapp: {
    /** Número oficial (apenas dígitos, com DDI). Necessário para mensagens pré-preenchidas. */
    number: whatsappNumber,
    /** Número formatado para exibição, ex.: (13) 99741-2905. */
    display: formatBrPhone(whatsappNumber),
    /** Link provisório do Instagram — não aceita texto pré-preenchido. */
    fallbackUrl:
      env(process.env.NEXT_PUBLIC_WHATSAPP_FALLBACK_URL) ?? "https://wa.me/message/KW6TKPHWGNFLC1",
  },

  instagram: {
    handle: "@j.a_odonto.estetica",
    url: "https://www.instagram.com/j.a_odonto.estetica/",
  },

  phone: env(process.env.NEXT_PUBLIC_PHONE),
  email: env(process.env.NEXT_PUBLIC_EMAIL),

  address: {
    street,
    district,
    city: "Santos",
    state: "SP",
    postalCode,
    country: "BR",
    /** Endereço completo só existe quando a rua foi configurada. */
    full: street
      ? [street, district, "Santos — SP", postalCode].filter(Boolean).join(", ")
      : undefined,
  },

  openingHours: env(process.env.NEXT_PUBLIC_OPENING_HOURS),

  responsible: {
    name: env(process.env.NEXT_PUBLIC_RESPONSIBLE_NAME),
    cro: env(process.env.NEXT_PUBLIC_RESPONSIBLE_CRO),
  },

  company: {
    legalName: env(process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME),
    cnpj: env(process.env.NEXT_PUBLIC_COMPANY_CNPJ),
  },

  analytics: {
    ga4Id: env(process.env.NEXT_PUBLIC_GA4_ID),
    metaPixelId: env(process.env.NEXT_PUBLIC_META_PIXEL_ID),
  },

  messages: {
    general: "Olá! Conheci a J.A pelo site e gostaria de agendar uma avaliação.",
    treatment: (name: string) =>
      `Olá! Conheci a J.A Odontologia Estética pelo site e gostaria de saber mais sobre o procedimento de ${name}.`,
  },
} as const;

export const navLinks = [
  { label: "Início", href: "/#inicio" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Tratamentos", href: "/#tratamentos" },
  { label: "Resultados", href: "/#resultados" },
  { label: "Dúvidas frequentes", href: "/#duvidas" },
  { label: "Contato", href: "/#contato" },
] as const;

/** Link de rota para o Google Maps (usa o endereço completo quando existir). */
export function mapsQuery() {
  return siteConfig.address.full ?? `${siteConfig.name}, Santos - SP`;
}
