import "server-only";

/**
 * "Ticket" assinado (HMAC) que vincula a referência do orçamento às URLs de
 * upload emitidas. Impede que alguém registre arquivos de outra solicitação.
 */
function secret() {
  return process.env.QUOTE_SIGNING_SECRET || process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

async function hmac(data: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Buffer.from(sig).toString("base64url");
}

export async function signTicket(reference: string, paths: string[]) {
  const exp = Date.now() + 3 * 60 * 60 * 1000;
  const payload = `${reference}|${exp}|${paths.join(",")}`;
  return `${Buffer.from(payload).toString("base64url")}.${await hmac(payload)}`;
}

export async function verifyTicket(ticket: string): Promise<{ reference: string; paths: string[] } | null> {
  if (!secret()) return null;
  const [encoded, sig] = ticket.split(".");
  if (!encoded || !sig) return null;
  const payload = Buffer.from(encoded, "base64url").toString();
  const expected = await hmac(payload);
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return null;
  const [reference, exp, list] = payload.split("|");
  if (Number(exp) < Date.now()) return null;
  return { reference, paths: list ? list.split(",") : [] };
}
