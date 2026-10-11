"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ENTITIES, isEntityKey, type AdminField, type EntityKey } from "@/lib/admin/entities";
import { requireAdmin } from "@/lib/admin/guard";
import { deleteEntry, seedEntity, upsertEntry } from "@/lib/admin/repo";
import { checkPassword, createSession, isAdminConfigured, SESSION_COOKIE } from "@/lib/admin/session";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { BUCKETS, getSupabaseAdmin } from "@/lib/supabase/server";

export type ActionState = { error?: string; ok?: string } | undefined;

export async function login(_: ActionState, form: FormData): Promise<ActionState> {
  if (!isAdminConfigured()) return { error: "Painel não configurado. Defina ADMIN_PASSWORD e ADMIN_SESSION_SECRET." };
  const ip = clientIp(await headers());
  if (!rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) return { error: "Muitas tentativas. Aguarde 15 minutos." };
  if (!(await checkPassword(String(form.get("password") ?? "")))) return { error: "Senha incorreta." };
  const session = await createSession();
  (await cookies()).set(SESSION_COOKIE, session.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: session.maxAge });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };

async function uploadImage(entity: string, file: File) {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new Error("Imagem deve ser JPG, PNG, WebP ou AVIF.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Imagem acima de 8 MB.");
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase não configurado");
  const path = `${entity}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKETS.siteMedia).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from(BUCKETS.siteMedia).getPublicUrl(path).data.publicUrl;
}

async function readField(entity: string, field: AdminField, form: FormData): Promise<unknown> {
  const raw = form.get(field.name);
  const str = typeof raw === "string" ? raw.trim() : "";
  switch (field.type) {
    case "list":
      return str.split("\n").map((l) => l.trim()).filter(Boolean);
    case "pairs":
      return str
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const [label, ...rest] = l.split(":");
          return { label: label.trim(), value: rest.join(":").trim() };
        });
    case "number":
      return Number(str || 0);
    case "boolean":
      return form.get(field.name) === "on";
    case "image": {
      if (form.get(`${field.name}__remove`) === "on") return null;
      const file = form.get(`${field.name}__file`);
      if (file instanceof File && file.size > 0) return uploadImage(entity, file);
      return str || null;
    }
    case "images": {
      const urls = str.split("\n").map((l) => l.trim()).filter(Boolean);
      for (const file of form.getAll(`${field.name}__file`)) if (file instanceof File && file.size > 0) urls.push(await uploadImage(entity, file));
      return urls;
    }
    default:
      return str;
  }
}

export async function saveEntry(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const entity = String(form.get("__entity"));
  if (!isEntityKey(entity)) return { error: "Entidade inválida." };
  const def = ENTITIES[entity];
  const data: Record<string, unknown> = {};
  try {
    for (const field of def.fields as readonly AdminField[]) data[field.name] = await readField(entity, field, form);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha no upload." };
  }
  const parsed = def.schema.safeParse(data);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: `${issue.path.join(".") || "Campo"}: ${issue.message}` };
  }
  let key: string;
  try {
    key = await upsertEntry(entity, parsed.data as Record<string, unknown>, form.get("__published") === "on", String(form.get("__previous") || "") || undefined);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao salvar." };
  }
  revalidatePath("/", "layout");
  redirect(`/admin/conteudo/${entity}?salvo=${encodeURIComponent(key)}`);
}

export async function removeEntry(form: FormData) {
  await requireAdmin();
  const entity = String(form.get("entity"));
  if (!isEntityKey(entity)) return;
  await deleteEntry(entity, String(form.get("key")));
  revalidatePath("/", "layout");
  redirect(`/admin/conteudo/${entity}`);
}

export async function seed(form: FormData) {
  await requireAdmin();
  const entity = String(form.get("entity")) as EntityKey;
  if (!isEntityKey(entity)) return;
  await seedEntity(entity);
  revalidatePath("/", "layout");
  redirect(`/admin/conteudo/${entity}`);
}

const STATUSES = ["novo", "em-analise", "respondido", "aprovado", "concluido", "arquivado"];

export async function setQuoteStatus(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  const status = String(form.get("status"));
  if (!STATUSES.includes(status)) return;
  await getSupabaseAdmin()?.from("quote_requests").update({ status }).eq("id", id);
  revalidatePath("/admin/orcamentos");
}
