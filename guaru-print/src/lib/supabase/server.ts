import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com a chave service_role — SOMENTE no servidor.
 * Retorna `null` quando o projeto ainda não foi configurado; nesse caso o site
 * usa os dados demonstrativos de `src/content`.
 */
let client: SupabaseClient | null | undefined;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  client = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return client;
}

export const isSupabaseConfigured = () => getSupabaseAdmin() !== null;

export const BUCKETS = {
  /** Artes enviadas por clientes — PRIVADO, acesso apenas por link assinado. */
  quoteFiles: "quote-files",
  /** Imagens do site cadastradas no painel — público. */
  siteMedia: "site-media",
} as const;
