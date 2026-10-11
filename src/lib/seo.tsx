import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { publishedTreatments } from "@/content/treatments";

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/**
 * Dados estruturados Schema.org (Dentist).
 * Somente informações configuradas são incluídas — nada é inventado.
 */
export function organizationJsonLd() {
  const { address, responsible } = siteConfig;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": absoluteUrl("/#clinica"),
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: absoluteUrl("/opengraph-image"),
    sameAs: [siteConfig.instagram.url],
    areaServed: { "@type": "City", name: "Santos" },
    address: {
      "@type": "PostalAddress",
      addressLocality: address.city,
      addressRegion: address.state,
      addressCountry: address.country,
      ...(address.street && { streetAddress: address.street }),
      ...(address.postalCode && { postalCode: address.postalCode }),
    },
    knowsAbout: publishedTreatments.map((t) => t.name),
  };
  data.telephone = siteConfig.phone ?? `+${siteConfig.whatsapp.number}`;
  if (siteConfig.email) data.email = siteConfig.email;
  if (responsible.name) {
    data.employee = { "@type": "Person", name: responsible.name, jobTitle: "Cirurgiã-dentista" };
  }
  return data;
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
