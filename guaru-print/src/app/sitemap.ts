import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getServices } from "@/lib/data/content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: [string, number][] = [
    ["", 1],
    ["/servicos", 0.9],
    ["/orcamento", 0.9],
    ["/portfolio", 0.8],
    ["/simulador", 0.7],
    ["/guia-de-impressao", 0.6],
    ["/sobre", 0.6],
    ["/contato", 0.7],
    ["/politica-de-privacidade", 0.2],
  ];
  const services = await getServices();
  return [
    ...pages.map(([path, priority]) => ({ url: `${siteConfig.url}${path}`, lastModified: now, changeFrequency: "monthly" as const, priority })),
    ...services.map((s) => ({ url: `${siteConfig.url}/servicos/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
