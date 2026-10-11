/**
 * Eventos de conversão.
 *
 * Só são enviados quando o visitante aceitou cookies de medição e quando
 * GA4/Meta Pixel estão configurados. NUNCA envie nome, telefone, mensagem ou
 * qualquer dado de saúde nos parâmetros.
 */

type EventName =
  | "whatsapp_click"
  | "schedule_click"
  | "treatment_select"
  | "form_submit"
  | "directions_click"
  | "contact_click";

type EventParams = {
  /** Onde o clique aconteceu (ex.: "hero", "menu", "card"). */
  location?: string;
  /** Slug do tratamento — informação de interesse, não de saúde individual. */
  treatment?: string;
  channel?: "whatsapp" | "instagram" | "phone" | "email" | "maps" | "webhook";
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const META_EVENTS: Partial<Record<EventName, string>> = {
  whatsapp_click: "Contact",
  schedule_click: "Schedule",
  form_submit: "Lead",
  treatment_select: "ViewContent",
};

export function trackEvent(name: EventName, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
  const metaEvent = META_EVENTS[name];
  if (metaEvent) window.fbq?.("track", metaEvent, { content_name: params.treatment });
}
