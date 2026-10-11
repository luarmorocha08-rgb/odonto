import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceQuickQuote } from "@/components/quote/ServiceQuickQuote";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import { ServiceMedia } from "@/components/ui/ServiceMedia";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/config/site";
import { services as staticServices } from "@/content/services";
import type { ProjectCategory } from "@/content/types";
import { getProjects, getService, getServices } from "@/lib/data/content";
import { JsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

const PROJECT_CATEGORY: Record<string, ProjectCategory[]> = {
  "adesivos-personalizados": ["adesivos"],
  banners: ["impressos"],
  cavaletes: ["impressos"],
  "fachadas-comerciais": ["fachadas", "luminosos"],
  "letreiros-e-luminosos": ["luminosos", "fachadas"],
  panfletos: ["impressos"],
  "impressos-personalizados": ["impressos"],
  sinalizacao: ["sinalizacao"],
};

export const dynamicParams = true;

export function generateStaticParams() {
  return staticServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return pageMetadata({
    title: `${service.name} em Guarujá`,
    description: `${service.description.slice(0, 150)}${service.description.length > 150 ? "…" : ""}`,
    path: `/servicos/${service.slug}`,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, all, projects] = await Promise.all([getService(slug), getServices(), getProjects()]);
  if (!service) notFound();
  const cats = PROJECT_CATEGORY[service.slug] ?? [];
  const examples = projects.filter((p) => cats.includes(p.category)).slice(0, 3);
  const related = all.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />
      <PageHeader eyebrow="Serviço" title={service.name} description={service.tagline} crumbs={[{ name: "Serviços", path: "/servicos" }, { name: service.name, path: `/servicos/${service.slug}` }]}>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="#orcamento" icon={<ArrowRight className="size-4" aria-hidden />} track={{ name: "quote_start", params: { location: "service-header", service: service.slug } }}>
            Solicitar orçamento
          </Button>
          <WhatsAppButton location="service-header" service={service.slug} label="Falar com especialista" message={siteConfig.messages.service(service.name.toLowerCase())} variant="ghost" />
        </div>
      </PageHeader>

      <section className="pb-20" aria-label="Detalhes do serviço">
        <div className="container-x grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div data-reveal className="overflow-hidden rounded-[1.75rem] border border-white/10">
            <ServiceMedia service={service} className="aspect-[4/3]" priority sizes="(min-width: 1024px) 55vw, 100vw" />
          </div>
          <div>
            <p className="text-lg leading-relaxed text-white/80">{service.description}</p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="font-sub text-sm font-semibold tracking-wider text-mute uppercase">Aplicações comuns</h2>
                <ul className="mt-4 space-y-2.5">
                  {service.applications.map((a) => (
                    <li key={a} className="flex gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden /> {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-sub text-sm font-semibold tracking-wider text-mute uppercase">Opções de personalização</h2>
                <ul className="mt-4 space-y-2.5">
                  {service.customization.map((a) => (
                    <li key={a} className="flex gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-magenta" aria-hidden /> {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <h2 className="mt-10 font-sub text-sm font-semibold tracking-wider text-mute uppercase">Especificações</h2>
            <dl className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {service.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-6 py-3 text-sm">
                  <dt className="text-mute">{s.label}</dt>
                  <dd className="text-right">{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-mute">Valores e prazos são informados no orçamento, de acordo com medidas, quantidade e acabamento.</p>
          </div>
        </div>
      </section>

      {examples.length > 0 && (
        <section className="py-20" aria-labelledby="exemplos-title">
          <div className="container-x">
            <div className="flex items-end justify-between gap-6">
              <h2 id="exemplos-title" className="display-md">
                Exemplos
              </h2>
              <Link href="/portfolio" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/70 hover:text-paper">
                Ver portfólio <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <ul data-stagger className="mt-8 grid gap-5 md:grid-cols-3">
              {examples.map((p) => (
                <li key={p.slug}>
                  <Link href={`/portfolio?projeto=${p.slug}`} className="group block" data-cursor="Ver">
                    <ProjectVisual project={p} className="aspect-[4/3] rounded-[1.5rem] border border-white/10" sizes="(min-width: 768px) 30vw, 100vw" />
                    <p className="mt-3 font-sub font-semibold group-hover:text-cyan">{p.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section id="orcamento" className="scroll-mt-24 py-20" aria-labelledby="form-title">
        <div className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="eyebrow">Orçamento</p>
            <h2 id="form-title" className="display-md mt-5">
              Monte seu pedido de {service.name.toLowerCase()}
            </h2>
            <p className="mt-4 text-white/65">Preencha o que souber. No próximo passo você envia a arte e seus dados — e recebe o retorno pelo WhatsApp.</p>
          </div>
          <div className="card p-5 md:p-10">
            <ServiceQuickQuote product={service.quoteProduct} service={service.slug} />
          </div>
        </div>
      </section>

      <section className="py-20" aria-labelledby="rel-title">
        <div className="container-x">
          <h2 id="rel-title" className="display-md">
            Outros serviços
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((s) => (
              <li key={s.slug}>
                <ServiceCard service={s} index={all.indexOf(s)} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
