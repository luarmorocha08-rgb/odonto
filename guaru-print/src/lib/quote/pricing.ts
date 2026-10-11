import type { ProductKey } from "@/content/types";
import type { QuoteItem } from "./products";

/**
 * ARQUITETURA PREPARADA PARA PREÇOS — ainda desativada.
 *
 * O site não exibe preços. Quando a empresa quiser estimativas automáticas,
 * cadastre regras na tabela `price_rules` (ver supabase/schema.sql) e ative
 * `PRICING_ENABLED`. Até lá, `estimate()` sempre retorna `null`, e a interface
 * mostra "valor informado pela equipe".
 */
export const PRICING_ENABLED = false;

export type PriceRule = {
  product: ProductKey;
  /** Ex.: "m2" (por área), "unit" (por unidade), "thousand" (milheiro). */
  basis: "m2" | "unit" | "thousand";
  /** Valor em centavos — definido exclusivamente pela empresa no painel. */
  amountCents: number;
  /** Filtros opcionais por campo (ex.: { material: "vinil-branco" }). */
  match?: Record<string, string>;
  minQuantity?: number;
};

export function estimate(_item: QuoteItem, _rules: PriceRule[]): number | null {
  if (!PRICING_ENABLED) return null;
  return null;
}
