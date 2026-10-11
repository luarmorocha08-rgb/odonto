import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { FaqItem, Service } from "@/content/types";
import type { Settings } from "@/lib/admin/entities";

export function JsonLd({ data }: { data: object }) {
  // `<` escapado evita fechar a tag <script> com conteúdo do painel.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${siteConfig.name}`, description, url: path, siteName: siteConfig.name, locale: siteConfig.locale, type: "website" },
  };
}

export function localBusinessJsonLd(settings: Settings) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}/opengraph-image`,
    telephone: `+${siteConfig.whatsapp.number}`,
    ...(settings.email ? { email: settings.email } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.state,
      addressCountry: siteConfig.country,
      ...(settings.streetAddress ? { streetAddress: settings.streetAddress } : {}),
      ...(settings.postalCode ? { postalCode: settings.postalCode } : {}),
    },
    areaServed: [{ "@type": "City", name: "Guarujá" }, { "@type": "Country", name: "Brasil" }],
    sameAs: [siteConfig.instagram.url],
    knowsAbout: ["Comunicação visual", "Adesivos personalizados", "Fachadas comerciais", "Banners", "Impressão gráfica"],
  };
}

export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    serviceType: service.name,
    url: `${siteConfig.url}/servicos/${service.slug}`,
    provider: { "@id": `${siteConfig.url}/#business` },
    areaServed: { "@type": "Country", name: "Brasil" },
  };
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: q.answer } })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: `${siteConfig.url}${item.path}` })),
  };
}
