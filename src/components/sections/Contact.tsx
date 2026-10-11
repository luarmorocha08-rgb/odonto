import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { mapsQuery, siteConfig } from "@/config/site";
import { ContactForm } from "@/components/ui/ContactForm";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { WhatsAppCta } from "@/components/ui/CtaLink";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { TrackedAnchor } from "@/components/ui/TrackedAnchor";
import { whatsappUrl } from "@/lib/whatsapp";

function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 border-t border-ink/12 py-5">
      <span aria-hidden className="mt-0.5 text-taupe-deep">
        {icon}
      </span>
      <div>
        <dt className="eyebrow text-[0.62rem] text-ink/60">{label}</dt>
        <dd className="mt-1.5 text-[0.95rem]">{children}</dd>
      </div>
    </div>
  );
}

export function Contact() {
  const { address, openingHours, instagram, phone } = siteConfig;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery())}`;
  const formMode = process.env.CONTACT_WEBHOOK_URL ? "webhook" : "whatsapp";

  return (
    <section id="contato" aria-labelledby="contato-title" data-tone="blush" className="relative py-28 md:py-40">
      <div className="container-lux">
        <p className="eyebrow mb-5 flex items-center gap-3 text-taupe-deep">
          <span className="h-px w-10 bg-current" />
          Localização e contato
        </p>
        <h2
          id="contato-title"
          data-reveal="lines"
          className="max-w-4xl font-display text-headline font-extralight tracking-[-0.03em] text-balance"
        >
          Estamos esperando <em className="font-light text-taupe-deep italic">por você.</em>
        </h2>

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <dl data-stagger>
              <InfoRow icon={<MapPin strokeWidth={1.3} className="size-5" />} label="Endereço">
                {address.full ?? "Santos — SP"}
              </InfoRow>
              {openingHours && (
                <InfoRow icon={<Clock strokeWidth={1.3} className="size-5" />} label="Horário de funcionamento">
                  {openingHours}
                </InfoRow>
              )}
              <InfoRow icon={<MessageCircle strokeWidth={1.3} className="size-5" />} label="WhatsApp">
                <TrackedAnchor
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  event="whatsapp_click"
                  params={{ location: "contact-info", channel: "whatsapp" }}
                  className="link-underline"
                >
                  Conversar com a clínica
                </TrackedAnchor>
              </InfoRow>
              {phone && (
                <InfoRow icon={<Phone strokeWidth={1.3} className="size-5" />} label="Telefone">
                  <TrackedAnchor
                    href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                    event="contact_click"
                    params={{ location: "contact-info", channel: "phone" }}
                    className="link-underline"
                  >
                    {phone}
                  </TrackedAnchor>
                </InfoRow>
              )}
              <InfoRow icon={<InstagramIcon className="size-5" />} label="Instagram">
                <TrackedAnchor
                  href={instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  event="contact_click"
                  params={{ location: "contact-info", channel: "instagram" }}
                  className="link-underline"
                >
                  {instagram.handle}
                </TrackedAnchor>
              </InfoRow>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsAppCta location="contact">Agendar pelo WhatsApp</WhatsAppCta>
              {address.full && (
                <TrackedAnchor
                  href={directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  event="directions_click"
                  params={{ location: "contact", channel: "maps" }}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-ink/25 px-6 text-[0.82rem] font-medium transition-colors hover:border-ink"
                >
                  <Navigation strokeWidth={1.4} className="size-4" aria-hidden />
                  Como chegar
                </TrackedAnchor>
              )}
            </div>

            {address.full && (
              <div data-reveal="fade" className="mt-10">
                <MapEmbed query={mapsQuery()} />
              </div>
            )}
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <div data-reveal="fade" className="rounded-[32px] bg-offwhite/80 p-7 md:p-10">
              <h3 className="font-display text-title font-light">Prefere que a gente fale com você?</h3>
              <p className="mt-3 mb-8 text-sm leading-relaxed text-ink/70">
                Deixe seus dados e o tratamento de interesse. Responderemos o quanto antes.
              </p>
              <ContactForm mode={formMode} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
