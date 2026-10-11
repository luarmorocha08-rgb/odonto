import "server-only";
import { faq } from "@/content/faq";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { getSettings } from "@/lib/data/content";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { ENTITIES, type EntityKey } from "./entities";

export type Entry = { key: string; data: Record<string, unknown>; published: boolean; sort: number; updatedAt?: string };

const DEMO: Record<Exclude<EntityKey, "settings">, Record<string, unknown>[]> = { service: services, project: projects, faq };

export function entryKey(entity: EntityKey, data: Record<string, unknown>) {
  const field = ENTITIES[entity].keyField;
  return field ? String(data[field]) : "main";
}

/** Lista registros do banco; sem banco (ou vazio), mostra os demonstrativos. */
export async function listEntries(entity: EntityKey): Promise<{ source: "db" | "demo"; items: Entry[] }> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.from("content_entries").select("key, data, published, sort, updated_at").eq("entity", entity).order("sort");
    if (!error && data?.length) {
      return { source: "db", items: data.map((r) => ({ key: r.key, data: r.data, published: r.published, sort: r.sort, updatedAt: r.updated_at })) };
    }
  }
  if (entity === "settings") return { source: "demo", items: [{ key: "main", data: await getSettings(), published: true, sort: 0 }] };
  return { source: "demo", items: DEMO[entity].map((d, i) => ({ key: entryKey(entity, d), data: d, published: true, sort: Number(d.order ?? i) })) };
}

export async function getEntry(entity: EntityKey, key: string) {
  const { items } = await listEntries(entity);
  return items.find((i) => i.key === key) ?? null;
}

export async function upsertEntry(entity: EntityKey, data: Record<string, unknown>, published: boolean, previousKey?: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase não configurado");
  const key = entryKey(entity, data);
  const sort = Number(data.order ?? 0);
  const { error } = await supabase.from("content_entries").upsert({ entity, key, data, published, sort, updated_at: new Date().toISOString() }, { onConflict: "entity,key" });
  if (error) throw new Error(error.message);
  if (previousKey && previousKey !== key) await supabase.from("content_entries").delete().eq("entity", entity).eq("key", previousKey);
  return key;
}

export async function deleteEntry(entity: EntityKey, key: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase não configurado");
  const { error } = await supabase.from("content_entries").delete().eq("entity", entity).eq("key", key);
  if (error) throw new Error(error.message);
}

/** Copia os dados demonstrativos para o banco, como ponto de partida editável. */
export async function seedEntity(entity: EntityKey) {
  const { items } = await listEntries(entity);
  for (const item of items) await upsertEntry(entity, item.data, true);
}

export type QuoteRow = {
  id: string;
  reference: string;
  created_at: string;
  status: string;
  items: unknown[];
  customer: Record<string, unknown>;
  files: string[];
  file_names: string[];
};

export async function listQuotes(status?: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  let q = supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(100);
  if (status) q = q.eq("status", status);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data as QuoteRow[];
}
