import { NextResponse } from "next/server";
import { z } from "zod";
import { isUnsafeSvg, kindFromName, sniffKind } from "@/lib/files";
import { createReference } from "@/lib/quote/message";
import { quoteRequestSchema } from "@/lib/quote/products";
import { verifyTicket } from "@/lib/quote/ticket";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { BUCKETS, getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

const bodySchema = z.object({
  request: quoteRequestSchema,
  reference: z.string().regex(/^GP-\d{6}-[A-Z0-9]{4}$/).optional(),
  ticket: z.string().max(4000).nullish(),
  uploaded: z.array(z.string().max(300)).max(10).default([]),
  fileNames: z.array(z.string().max(200)).max(10).default([]),
  /** Honeypot: humanos não preenchem. */
  website: z.string().max(0).optional(),
});

/** Confere no storage que o arquivo existe e é mesmo do tipo declarado. */
async function verifyStoredFile(path: string) {
  const supabase = getSupabaseAdmin()!;
  const { data } = await supabase.storage.from(BUCKETS.quoteFiles).createSignedUrl(path, 60);
  if (!data?.signedUrl) return false;
  const res = await fetch(data.signedUrl, { headers: { Range: "bytes=0-4095" } }).catch(() => null);
  if (!res || !res.ok) return false;
  const bytes = new Uint8Array(await res.arrayBuffer());
  const kind = sniffKind(bytes);
  if (!kind || kind !== kindFromName(path)) return false;
  if (kind === "svg") {
    const full = await supabase.storage.from(BUCKETS.quoteFiles).download(path);
    if (!full.data || isUnsafeSvg(await full.data.text())) return false;
  }
  return true;
}

/**
 * Passo 2: registra a solicitação. Com Supabase, salva no banco e devolve
 * links assinados e temporários das artes; sem Supabase, apenas valida e
 * devolve a referência (o cliente envia a arte pelo próprio WhatsApp).
 */
export async function POST(request: Request) {
  if (!rateLimit(`quote:${clientIp(request.headers)}`, 8, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Muitas solicitações. Aguarde alguns minutos ou fale pelo WhatsApp." }, { status: 429 });
  }
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos.", issues: parsed.error.issues.slice(0, 5).map((i) => i.message) }, { status: 400 });
  }
  const { request: quote, ticket, uploaded, fileNames } = parsed.data;
  if (parsed.data.website) return NextResponse.json({ reference: createReference(), stored: false, fileLinks: [] });

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ reference: parsed.data.reference ?? createReference(), stored: false, fileLinks: [] });
  }

  // Arquivos: só aceita caminhos emitidos para esta referência (ticket assinado).
  let reference = parsed.data.reference ?? createReference();
  let files: string[] = [];
  if (uploaded.length) {
    const t = ticket ? await verifyTicket(ticket) : null;
    if (!t) return NextResponse.json({ error: "Envio de arquivos expirado. Tente novamente." }, { status: 400 });
    reference = t.reference;
    files = uploaded.filter((p) => t.paths.includes(p));
    const checks = await Promise.all(files.map(verifyStoredFile));
    const bad = files.filter((_, i) => !checks[i]);
    if (bad.length) {
      await supabase.storage.from(BUCKETS.quoteFiles).remove(bad);
      files = files.filter((p) => !bad.includes(p));
    }
  }

  const { error } = await supabase.from("quote_requests").insert({
    reference,
    items: quote.items,
    customer: { ...quote.customer, consent: true },
    files,
    file_names: fileNames,
    source: quote.source ?? "site",
    status: "novo",
  });
  if (error) {
    console.error("[quote] insert:", error.message);
    // Não bloqueia o cliente: a conversa no WhatsApp continua sendo o canal principal.
    return NextResponse.json({ reference, stored: false, fileLinks: [] });
  }

  const days = Math.min(30, Math.max(1, Number(process.env.QUOTE_FILE_LINK_DAYS) || 7));
  const fileLinks: { name: string; url: string }[] = [];
  for (const path of files) {
    const { data } = await supabase.storage.from(BUCKETS.quoteFiles).createSignedUrl(path, days * 24 * 60 * 60);
    if (data?.signedUrl) fileLinks.push({ name: path.split("/").pop() ?? "arte", url: data.signedUrl });
  }

  return NextResponse.json({ reference, stored: true, fileLinks });
}
