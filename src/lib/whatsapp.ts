import { siteConfig } from "@/config/site";

/** Indica se as mensagens pré-preenchidas estão disponíveis (número oficial configurado). */
export const supportsPrefilledMessage = Boolean(siteConfig.whatsapp.number);

/**
 * Monta o link do WhatsApp.
 * - Com número oficial: `wa.me/<numero>?text=<mensagem>`.
 * - Sem número: usa o link provisório (a mensagem não é enviada junto).
 */
export function whatsappUrl(message: string = siteConfig.messages.general) {
  if (siteConfig.whatsapp.number) {
    return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`;
  }
  return siteConfig.whatsapp.fallbackUrl;
}

export function treatmentWhatsappUrl(treatmentName: string) {
  return whatsappUrl(siteConfig.messages.treatment(treatmentName));
}
