import type { MetadataRoute } from "next";
import { publishedTreatments } from "@/content/treatments";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...publishedTreatments.map((t) => ({
      url: absoluteUrl(`/tratamentos/${t.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: absoluteUrl("/politica-de-privacidade"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
