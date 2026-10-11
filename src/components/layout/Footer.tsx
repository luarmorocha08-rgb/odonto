import Link from "next/link";
import { navLinks, siteConfig } from "@/config/site";
import { publishedTreatments } from "@/content/treatments";
import { Logo } from "@/components/ui/Logo";
import { whatsappUrl } from "@/lib/whatsapp";

export function Footer() {
  const year = new Date().getFullYear();
  const { responsible, company, address, instagram } = siteConfig;

  return (
    <footer className="relative overflow-hidden bg-ink text-offwhite" data-footer>
      <div data-footer-inner className="container-lux pt-24 pb-10 md:pt-32">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo tone="light" />
            <p className="mt-8 max-w-sm font-display text-2xl leading-snug font-light text-offwhite/90 md:text-3xl">
              Realce sua beleza. <em className="text-blush italic">Preserve sua essência.</em>
            </p>
          </div>

          <nav aria-label="Rodapé — navegação" className="md:col-span-2">
            <p className="eyebrow mb-5 text-blush">Navegação</p>
            <ul className="space-y-3 text-sm text-offwhite/75">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-underline hover:text-offwhite">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Rodapé — tratamentos" className="md:col-span-2">
            <p className="eyebrow mb-5 text-blush">Tratamentos</p>
            <ul className="space-y-3 text-sm text-offwhite/75">
              {publishedTreatments.map((t) => (
                <li key={t.slug}>
                  <Link href={`/tratamentos/${t.slug}`} className="link-underline hover:text-offwhite">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="eyebrow mb-5 text-blush">Contato</p>
            <ul className="space-y-3 text-sm text-offwhite/75">
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-offwhite">
                  WhatsApp {siteConfig.whatsapp.display}
                </a>
              </li>
              <li>
                <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-offwhite">
                  Instagram {instagram.handle}
                </a>
              </li>
              {siteConfig.phone && (
                <li>
                  <a href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`} className="link-underline hover:text-offwhite">
                    {siteConfig.phone}
                  </a>
                </li>
              )}
              {siteConfig.email && (
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="link-underline hover:text-offwhite">
                    {siteConfig.email}
                  </a>
                </li>
              )}
              <li>{address.full ?? "Santos — SP"}</li>
            </ul>
          </div>
        </div>

        {/* Marca d'água decorativa em SVG (não é conteúdo textual) */}
        <svg
          aria-hidden
          viewBox="0 0 100 34"
          className="pointer-events-none mt-20 block w-[78%] fill-offwhite/[0.06] select-none md:w-[62%]"
        >
          <text x="-1" y="30" className="font-display" fontSize="40" fontWeight="200" letterSpacing="-3">
            J.A
          </text>
        </svg>

        <div className="mt-6 flex flex-col gap-6 border-t border-offwhite/10 pt-8 text-xs leading-relaxed text-offwhite/60 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            {/* Informações profissionais obrigatórias — preenchidas via variáveis de ambiente. */}
            {responsible.name && (
              <p>
                Responsável técnica: {responsible.name}
                {responsible.cro && <> — {responsible.cro}</>}
              </p>
            )}
            {company.legalName && company.cnpj && (
              <p>
                {company.legalName} — CNPJ {company.cnpj}
              </p>
            )}
            <p>
              Conteúdo informativo. Não substitui avaliação individual. Resultados variam de pessoa para pessoa.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/politica-de-privacidade" className="link-underline hover:text-offwhite">
              Política de Privacidade
            </Link>
            <span>
              © {year} {siteConfig.name}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
