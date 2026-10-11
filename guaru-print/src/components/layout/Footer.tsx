import { ArrowUpRight, MapPin, Truck } from "lucide-react";
import Link from "next/link";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { Logo } from "@/components/ui/Logo";
import { mainNav, siteConfig } from "@/config/site";
import type { Service } from "@/content/types";
import type { Settings } from "@/lib/admin/entities";
import { whatsappUrl } from "@/lib/whatsapp";

export function Footer({ services, settings }: { services: Service[]; settings: Settings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-ink pt-20 pb-10">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="text-3xl" />
            <p className="mt-6 max-w-sm text-white/60">
              {siteConfig.shortDescription}. {siteConfig.yearsActive} anos transformando ideias em impressão.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-cyan" aria-hidden />
                {settings.streetAddress ? `${settings.streetAddress} — ` : ""}
                {siteConfig.city} - {siteConfig.state}
              </li>
              <li className="flex items-center gap-2">
                <Truck className="size-4 text-magenta" aria-hidden /> Enviamos para todo o Brasil
              </li>
              {settings.openingHours && <li className="pl-6">{settings.openingHours}</li>}
            </ul>
          </div>

          <nav aria-label="Serviços no rodapé">
            <p className="eyebrow mb-5">Serviços</p>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/servicos/${s.slug}`} className="text-white/70 transition hover:text-paper">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Navegação no rodapé">
            <p className="eyebrow mb-5">Navegue</p>
            <ul className="space-y-2.5">
              {[...mainNav, { href: "/orcamento", label: "Solicitar orçamento" }, { href: "/politica-de-privacidade", label: "Privacidade" }].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/70 transition hover:text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow mb-5">Fale com a gente</p>
            <ul className="space-y-3">
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-white/80 hover:text-paper">
                  <WhatsAppIcon className="size-5 text-[#25D366]" />
                  {settings.whatsappDisplay}
                  <ArrowUpRight className="size-4 opacity-0 transition group-hover:opacity-100" aria-hidden />
                </a>
              </li>
              <li>
                <a href={siteConfig.instagram.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-white/80 hover:text-paper">
                  <InstagramIcon className="size-5 text-magenta" />
                  {settings.instagramHandle}
                  <ArrowUpRight className="size-4 opacity-0 transition group-hover:opacity-100" aria-hidden />
                </a>
              </li>
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="text-white/80 hover:text-paper">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <p
          aria-hidden
          className="mt-20 font-display text-[clamp(3.5rem,17vw,15rem)] leading-[0.8] font-extrabold tracking-[-0.06em] text-white/[0.04] uppercase italic select-none"
        >
          Guaru Print
        </p>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.name}. Todos os direitos reservados.
          </p>
          <div className="flex h-1.5 w-24 overflow-hidden rounded-full" aria-hidden>
            <span className="flex-1 bg-cyan" />
            <span className="flex-1 bg-magenta" />
            <span className="flex-1 bg-yellow" />
            <span className="flex-1 bg-white" />
          </div>
        </div>
      </div>
    </footer>
  );
}
