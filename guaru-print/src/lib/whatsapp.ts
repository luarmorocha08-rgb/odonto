import { siteConfig } from "@/config/site";

/** Link `wa.me` com a mensagem já preenchida. */
export function whatsappUrl(message: string = siteConfig.messages.general) {
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export function serviceWhatsappUrl(serviceName: string) {
  return whatsappUrl(siteConfig.messages.service(serviceName));
}
