import "server-only";
import { cache } from "react";
import { faq as staticFaq } from "@/content/faq";
import { projects as staticProjects } from "@/content/projects";
import { services as staticServices } from "@/content/services";
import type { FaqItem, Project, Service } from "@/content/types";
import { siteConfig } from "@/config/site";
import { ENTITIES, type EntityKey, type Settings } from "@/lib/admin/entities";
import { getSupabaseAdmin } from "@/lib/supabase/server";

/**
 * Camada de conteúdo.
 * Com Supabase configurado e com registros publicados, usa o banco; senão, os
 * dados demonstrativos de `src/content`. Registros inválidos são ignorados
 * (com aviso no log) para nunca quebrar uma página pública.
 */
const loadEntries = cache(async (entity: EntityKey): Promise<unknown[] | null> => {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("content_entries")
    .select("data")
    .eq("entity", entity)
    .eq("published", true)
    .order("sort", { ascending: true });
  if (error) {
    console.error(`[content] falha ao carregar ${entity}:`, error.message);
    return null;
  }
  if (!data?.length) return null;
  const schema = ENTITIES[entity].schema;
  return data.flatMap((row) => {
    const parsed = schema.safeParse(row.data);
    if (!parsed.success) {
      console.warn(`[content] registro inválido em ${entity} ignorado`);
      return [];
    }
    return [parsed.data];
  });
});

const byOrder = <T extends { order: number }>(items: T[]) => [...items].sort((a, b) => a.order - b.order);

export const getServices = cache(async (): Promise<Service[]> => {
  const rows = (await loadEntries("service")) as Service[] | null;
  return byOrder(rows?.length ? rows : staticServices);
});

export async function getService(slug: string) {
  return (await getServices()).find((s) => s.slug === slug) ?? null;
}

export const getProjects = cache(async (): Promise<Project[]> => {
  const rows = (await loadEntries("project")) as Project[] | null;
  return byOrder(rows?.length ? rows : staticProjects);
});

export const getFaq = cache(async (): Promise<FaqItem[]> => {
  const rows = (await loadEntries("faq")) as FaqItem[] | null;
  return byOrder(rows?.length ? rows : staticFaq);
});

export const getSettings = cache(async (): Promise<Settings> => {
  const rows = (await loadEntries("settings")) as Settings[] | null;
  const base: Settings = {
    whatsappDisplay: siteConfig.whatsapp.display,
    instagramHandle: siteConfig.instagram.handle,
    streetAddress: siteConfig.streetAddress ?? undefined,
    postalCode: siteConfig.postalCode ?? undefined,
    openingHours: siteConfig.openingHours ?? undefined,
    email: siteConfig.email ?? undefined,
    aboutText: undefined,
  };
  const saved = rows?.[0];
  if (!saved) return base;
  // Campos vazios no painel não apagam os valores confirmados.
  const filled = Object.fromEntries(Object.entries(saved).filter(([, v]) => v !== "" && v != null));
  return { ...base, ...filled };
});
