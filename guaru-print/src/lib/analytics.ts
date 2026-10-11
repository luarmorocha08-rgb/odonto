/**
 * Eventos de conversão.
 *
 * Só chegam ao GA4/Meta Pixel quando o visitante aceitou cookies de medição e
 * os IDs estão configurados. Nunca envie nome, telefone, e-mail ou arquivos.
 */
export type EventName =
  | "whatsapp_click"
  | "quote_start"
  | "quote_submit"
  | "form_submit"
  | "simulator_use"
  | "simulator_export"
  | "service_interaction"
  | "calculator_use"
  | "quote_list_add"
  | "search_use"
  | "assistant_complete";

export type EventParams = {
  /** Onde a interação aconteceu (ex.: "hero", "header", "service-card"). */
  location?: string;
  /** Slug do produto/serviço de interesse. */
  service?: string;
  /** Quantidade de itens (lista de orçamento). */
  items?: number;
  action?: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const META_EVENTS: Partial<Record<EventName, string>> = {
  whatsapp_click: "Contact",
  quote_submit: "Lead",
  form_submit: "Lead",
  service_interaction: "ViewContent",
  simulator_use: "CustomizeProduct",
  quote_list_add: "AddToCart",
};

export function trackEvent(name: EventName, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
  const metaEvent = META_EVENTS[name];
  if (metaEvent) window.fbq?.("track", metaEvent, { content_name: params.service });
  if (process.env.NODE_ENV === "development") console.debug("[analytics]", name, params);
}
