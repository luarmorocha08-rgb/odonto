import { siteConfig } from "@/config/site";
import { calculateDimensions, formatArea, formatNumber } from "@/lib/units";
import { PRODUCT_MAP, formatFieldValue, type QuoteItem } from "./products";

export type SummaryLine = { label: string; value: string };

/** Linhas legíveis de um item, usadas no resumo e na mensagem. */
export function describeItem(item: QuoteItem): { title: string; lines: SummaryLine[] } {
  const def = PRODUCT_MAP[item.product];
  const lines: SummaryLine[] = [];
  const w = Number(item.width);
  const h = Number(item.height);
  if (w > 0 && h > 0 && item.unit) {
    const dims = calculateDimensions(w, h, item.unit, item.quantity);
    lines.push({
      label: "Dimensões",
      value: `${formatNumber(w)} × ${formatNumber(h)} ${item.unit}${dims ? ` (${formatArea(dims.areaM2)} cada)` : ""}`,
    });
  }
  lines.push({ label: "Quantidade", value: formatNumber(item.quantity, 0) });
  for (const field of def.fields) {
    const value = formatFieldValue(field, item.details[field.name]);
    if (value) lines.push({ label: field.label.replace(/\s*\(.*\)$/, ""), value });
  }
  return { title: def.label, lines };
}

export type MessageInput = {
  items: QuoteItem[];
  customer: { name: string; city: string; cep?: string; notes?: string; needsDesign?: boolean };
  reference?: string | null;
  fileLinks?: { name: string; url: string }[];
  fileNames?: string[];
};

/**
 * Mensagem pré-preenchida para o WhatsApp.
 * Não inclui telefone/e-mail (a conversa já identifica o cliente).
 */
export function buildQuoteMessage({ items, customer, reference, fileLinks = [], fileNames = [] }: MessageInput) {
  const out: string[] = [];
  out.push(`Olá, ${siteConfig.name}! Gostaria de solicitar um orçamento pelo site.`);
  if (reference) out.push(`*Referência:* ${reference}`);
  out.push("");
  items.forEach((item, index) => {
    const { title, lines } = describeItem(item);
    out.push(items.length > 1 ? `*${index + 1}. ${title}*` : `*Produto:* ${title}`);
    for (const line of lines) out.push(`• ${line.label}: ${line.value}`);
    out.push("");
  });
  out.push(`*Nome:* ${customer.name}`);
  out.push(`*Cidade:* ${customer.city}${customer.cep ? ` — CEP ${customer.cep.replace(/^(\d{5})(\d{3})$/, "$1-$2")}` : ""}`);
  if (customer.needsDesign) out.push("*Arte:* preciso de criação/ajuste de arte");
  if (fileLinks.length) {
    out.push("*Arte enviada (link privado e temporário):*");
    for (const f of fileLinks) out.push(`${f.name}: ${f.url}`);
  }
  if (fileNames.length) {
    out.push(`*Arte${fileLinks.length ? " (outros arquivos)" : ""}:* ${fileNames.join(", ")} — envio nesta conversa.`);
  }
  if (customer.notes?.trim()) {
    out.push("");
    out.push(`*Observações:* ${customer.notes.trim()}`);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/** Referência legível (ex.: GP-251011-7KQ3). Gerada no servidor quando há banco. */
export function createReference(date = new Date()) {
  const y = String(date.getFullYear()).slice(2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(4);
  globalThis.crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `GP-${y}${m}${d}-${suffix}`;
}
