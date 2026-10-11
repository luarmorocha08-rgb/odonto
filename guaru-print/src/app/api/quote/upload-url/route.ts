import { NextResponse } from "next/server";
import { z } from "zod";
import { kindFromName, MAX_FILE_BYTES, MAX_FILES, safeFileName } from "@/lib/files";
import { createReference } from "@/lib/quote/message";
import { signTicket } from "@/lib/quote/ticket";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { BUCKETS, getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

const bodySchema = z.object({
  files: z
    .array(z.object({ name: z.string().min(1).max(200), size: z.number().int().positive().max(MAX_FILE_BYTES), type: z.string().max(100) }))
    .max(MAX_FILES),
});

/**
 * Passo 1 do envio: gera a referência e URLs de upload assinadas (válidas por
 * 2 h) para o bucket PRIVADO. Os arquivos vão do navegador direto ao
 * Supabase — sem passar pelo servidor do site (sem limite de 4,5 MB da Vercel).
 */
export async function POST(request: Request) {
  if (!rateLimit(`upload:${clientIp(request.headers)}`, 15, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 });
  }
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Arquivos inválidos." }, { status: 400 });
  if (parsed.data.files.some((f) => !kindFromName(f.name))) {
    return NextResponse.json({ error: "Formato não aceito." }, { status: 400 });
  }

  const reference = createReference();
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ reference, storage: false, uploads: [], ticket: null });
  }

  const uploads: { path: string; signedUrl: string; name: string }[] = [];
  for (const [i, file] of parsed.data.files.entries()) {
    const path = `${reference}/${i + 1}-${safeFileName(file.name)}`;
    const { data, error } = await supabase.storage.from(BUCKETS.quoteFiles).createSignedUploadUrl(path);
    if (error || !data) {
      console.error("[quote] signed upload url:", error?.message);
      return NextResponse.json({ reference, storage: false, uploads: [], ticket: null });
    }
    uploads.push({ path, signedUrl: data.signedUrl, name: file.name });
  }

  const ticket = await signTicket(reference, uploads.map((u) => u.path));
  return NextResponse.json({ reference, storage: true, uploads, ticket });
}
