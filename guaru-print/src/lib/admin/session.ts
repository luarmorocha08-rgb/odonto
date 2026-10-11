/**
 * Sessão do painel: cookie httpOnly assinado com HMAC-SHA256 (Web Crypto),
 * compatível com o proxy (edge) e com o servidor Node.
 *
 * Preparado para trocar por Supabase Auth no futuro: basta substituir
 * `verifySession`/`createSession` mantendo a mesma interface.
 */
export const SESSION_COOKIE = "gp_admin";
const MAX_AGE_S = 60 * 60 * 8;

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET ?? "";
  return s.length >= 32 ? s : null;
}

export function isAdminConfigured() {
  return Boolean(secret() && (process.env.ADMIN_PASSWORD ?? "").length >= 12);
}

function toB64Url(buf: ArrayBuffer) {
  let s = "";
  for (const b of new Uint8Array(buf)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(data: string, key: string) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toB64Url(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(data)));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSession() {
  const key = secret();
  if (!key) throw new Error("ADMIN_SESSION_SECRET ausente ou curto");
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE_S);
  return { value: `${exp}.${await sign(`admin|${exp}`, key)}`, maxAge: MAX_AGE_S };
}

export async function verifySession(value: string | undefined | null) {
  const key = secret();
  if (!key || !value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || Number(exp) * 1000 < Date.now()) return false;
  return safeEqual(sig, await sign(`admin|${exp}`, key));
}

/** Compara a senha sem vazar tempo de comparação. */
export async function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  const key = secret();
  if (!key || expected.length < 12) return false;
  const [a, b] = await Promise.all([sign(input, key), sign(expected, key)]);
  return safeEqual(a, b);
}
