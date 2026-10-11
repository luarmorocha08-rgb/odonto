import { MapPin, Truck } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { PageHeader } from "@/components/ui/PageHeader";
import { siteConfig } from "@/config/site";
import { getSettings } from "@/lib/data/content";
import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata({
  title: "Contato",
  description: "Fale com a Guaru Print pelo WhatsApp (13) 99209-5305 ou Instagram @grafica.guaruprint. Gráfica em Guarujá/SP com envio para todo o Brasil.",
  path: "/contato",
});

export default async function ContactPage() {
  const settings = await getSettings();
  const mapQuery = encodeURIComponent(settings.streetAddress ? `${settings.streetAddress}, ${siteConfig.city} - ${siteConfig.state}` : `${siteConfig.city} - ${siteConfig.state}`);
  return (
    <>
      <PageHeader eyebrow="Contato" title="Vamos conversar?" description="Atendimento pelo WhatsApp e pelo Instagram. Envie sua dúvida, sua arte ou peça um orçamento." crumbs={[{ name: "Contato", path: "/contato" }]} />
      <section className="pb-28" aria-label="Canais de contato">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-5 rounded-[1.5rem] border border-white/10 bg-ink-2 p-6 transition hover:border-[#25D366]">
              <span className="grid size-14 place-items-center rounded-full bg-[#25D366] text-ink">
                <WhatsAppIcon className="size-7" />
              </span>
              <span>
                <span className="block text-sm text-mute">WhatsApp</span>
                <span className="block font-display text-2xl">{settings.whatsappDisplay}</span>
              </span>
            </a>
            <a href={siteConfig.instagram.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-5 rounded-[1.5rem] border border-white/10 bg-ink-2 p-6 transition hover:border-magenta">
              <span className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-yellow via-magenta to-cyan text-ink">
                <InstagramIcon className="size-7" />
              </span>
              <span>
                <span className="block text-sm text-mute">Instagram</span>
                <span className="block font-display text-2xl">{settings.instagramHandle}</span>
              </span>
            </a>
            <div className="rounded-[1.5rem] border border-white/10 bg-ink-2 p-6">
              <p className="flex items-center gap-3 font-sub font-semibold">
                <MapPin className="size-5 text-cyan" aria-hidden />
                {settings.streetAddress ? `${settings.streetAddress} — ` : ""}
                {siteConfig.city} - {siteConfig.state}
              </p>
              {settings.openingHours && <p className="mt-2 pl-8 text-sm text-white/70">{settings.openingHours}</p>}
              <p className="mt-3 flex items-center gap-3 text-sm text-white/70">
                <Truck className="size-5 text-magenta" aria-hidden /> Enviamos para todo o Brasil
              </p>
              <div className="mt-5 aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  title={`Mapa: ${siteConfig.city} - ${siteConfig.state}`}
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full grayscale invert-[0.9] hue-rotate-180"
                />
              </div>
              {!settings.streetAddress && <p className="mt-2 text-xs text-mute">O endereço completo será informado em breve. Combine a retirada pelo WhatsApp.</p>}
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
