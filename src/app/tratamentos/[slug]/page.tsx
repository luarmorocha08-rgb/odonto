import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { publishedTreatments, getTreatment } from "@/content/treatments";
import { Accordion } from "@/components/ui/Accordion";
import { WhatsAppCta } from "@/components/ui/CtaLink";
import { Media } from "@/components/ui/Media";
import { absoluteUrl, faqJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedTreatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) return {};
  return pageMetadata({
    title: treatment.seo.title,
    description: treatment.seo.description,
    path: `/tratamentos/${treatment.slug}`,
  });
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div data-reveal="fade" className="border-t border-ink/15 pt-7">
      <h2 className="eyebrow text-taupe-deep">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink/80">
            <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-taupe" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function TreatmentPage({ params }: Props) {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) notFound();

  const index = publishedTreatments.findIndex((t) => t.slug === slug);
  const next = publishedTreatments[(index + 1) % publishedTreatments.length];
  const ctaTreatment = { slug: treatment.slug, name: treatment.name };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Tratamentos", item: absoluteUrl("/#tratamentos") },
      { "@type": "ListItem", position: 3, name: treatment.name, item: absoluteUrl(`/tratamentos/${slug}`) },
    ],
  };
  const procedure = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: treatment.name,
    description: treatment.detail.intro,
    url: absoluteUrl(`/tratamentos/${slug}`),
    provider: { "@id": absoluteUrl("/#clinica"), name: siteConfig.name },
  };

  return (
    <article>
      <JsonLd data={breadcrumb} />
      <JsonLd data={procedure} />
      <JsonLd data={faqJsonLd(treatment.detail.faq)} />

      <header className="container-lux pt-32 pb-16 md:pt-44 md:pb-24">
        <Link
          href="/#tratamentos"
          className="link-underline inline-flex items-center gap-2 text-[0.8rem] text-ink/70 hover:text-ink"
        >
          <ArrowLeft strokeWidth={1.4} className="size-4" aria-hidden />
          Todos os tratamentos
        </Link>

        <div className="mt-12 grid items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-3 text-taupe-deep">
              <span className="h-px w-10 bg-current" />
              {treatment.category} · Santos — SP
            </p>
            <h1
              data-reveal="lines"
              className="mt-6 font-display text-display font-extralight tracking-[-0.035em] text-balance"
            >
              {treatment.name}
            </h1>
            <p data-reveal="fade" className="mt-8 max-w-xl text-base leading-relaxed text-ink/75 md:text-lg">
              {treatment.detail.intro}
            </p>
            <div data-reveal="fade" className="mt-10 flex flex-wrap gap-3">
              <WhatsAppCta location="treatment-page-hero" treatment={ctaTreatment}>
                Agendar avaliação
              </WhatsAppCta>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div data-mask className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[28px]">
              <div data-mask-inner className="absolute inset-0">
                <Media asset={treatment.image} sizes="(min-width: 1024px) 40vw, 100vw" priority />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section aria-label="Detalhes do procedimento" data-tone="white" className="py-20 md:py-28">
        <div className="container-lux grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <h2 data-reveal="lines" className="font-display text-title font-extralight text-balance">
                Como funciona o cuidado com {treatment.name.toLowerCase()}
              </h2>
              <ol className="mt-8 space-y-6">
                {treatment.detail.howItWorks.map((step, i) => (
                  <li key={step} data-reveal="fade" className="flex gap-4">
                    <span className="font-display text-2xl font-extralight text-taupe-deep">0{i + 1}</span>
                    <p className="text-[0.95rem] leading-relaxed text-ink/80">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="grid gap-12 lg:col-span-7 lg:col-start-6">
            <List title="Indicações gerais" items={treatment.detail.indications} />
            <List title="Benefícios possíveis" items={treatment.detail.benefits} />
            <List title="Cuidados e limitações" items={treatment.detail.care} />
            <p className="rounded-2xl bg-offwhite p-5 text-xs leading-relaxed text-ink/70">
              As informações desta página são gerais e não substituem a avaliação individual. Indicações, riscos e
              resultados variam de pessoa para pessoa e são discutidos em consulta com a profissional responsável.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-tratamento" data-tone="offwhite" className="py-20 md:py-28">
        <div className="container-lux grid gap-12 lg:grid-cols-12">
          <h2
            id="faq-tratamento"
            data-reveal="lines"
            className="font-display text-title font-extralight lg:col-span-4"
          >
            Perguntas frequentes sobre {treatment.name.toLowerCase()}
          </h2>
          <div className="lg:col-span-7 lg:col-start-6">
            <Accordion items={treatment.detail.faq} />
          </div>
        </div>
      </section>

      <section aria-label="Agendamento" data-tone="taupe" className="py-20 md:py-28">
        <div className="container-lux flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-ink/70">Avaliação personalizada</p>
            <h2 data-reveal="lines" className="mt-5 max-w-2xl font-display text-headline font-extralight text-balance">
              Vamos conversar sobre o seu caso?
            </h2>
          </div>
          <div className="flex flex-col items-start gap-6">
            <WhatsAppCta location="treatment-page-footer" treatment={ctaTreatment}>
              Agendar avaliação
            </WhatsAppCta>
            <Link href={`/tratamentos/${next.slug}`} className="link-underline text-sm">
              Próximo: {next.name}
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
