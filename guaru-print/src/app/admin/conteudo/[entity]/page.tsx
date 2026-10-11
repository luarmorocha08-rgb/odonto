import { Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { removeEntry, seed } from "@/app/admin/actions";
import { AdminShell, DemoNotice } from "@/components/admin/AdminShell";
import { ENTITIES, isEntityKey } from "@/lib/admin/entities";
import { requireAdmin } from "@/lib/admin/guard";
import { listEntries } from "@/lib/admin/repo";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function EntityList({ params, searchParams }: { params: Promise<{ entity: string }>; searchParams: Promise<{ salvo?: string }> }) {
  await requireAdmin();
  const { entity } = await params;
  const { salvo } = await searchParams;
  if (!isEntityKey(entity)) notFound();
  if (entity === "settings") redirect("/admin/conteudo/settings/main");
  const def = ENTITIES[entity];
  const { source, items } = await listEntries(entity);
  const db = isSupabaseConfigured();

  return (
    <AdminShell
      title={def.label}
      actions={
        db && (
          <div className="flex gap-2">
            {source === "demo" && (
              <form action={seed}>
                <input type="hidden" name="entity" value={entity} />
                <button className="min-h-11 rounded-full border border-white/20 px-4 text-sm font-semibold hover:border-white/50">Importar para o banco</button>
              </form>
            )}
            <Link href={`/admin/conteudo/${entity}/novo`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-paper px-5 text-sm font-semibold text-ink">
              <Plus className="size-4" aria-hidden /> Novo {def.singular}
            </Link>
          </div>
        )
      }
    >
      {source === "demo" && <DemoNotice configured={db} />}
      {salvo && <p className="mb-6 rounded-2xl bg-[#25D366]/10 p-4 text-sm text-[#7ff0aa]">Salvo: {salvo}. O site é atualizado em instantes.</p>}
      <ul className="divide-y divide-white/10 rounded-2xl border border-white/10">
        {items.map((item) => {
          const title = String(item.data[def.titleField ?? "key"] ?? item.key);
          return (
            <li key={item.key} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{title}</p>
                <p className="text-xs text-mute">
                  {item.key}
                  {!item.published && " · rascunho"}
                  {item.data.placeholder === true && " · exemplo ilustrativo"}
                </p>
              </div>
              {source === "db" && (
                <>
                  <Link href={`/admin/conteudo/${entity}/${encodeURIComponent(item.key)}`} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm hover:border-white/40">
                    <Pencil className="size-3.5" aria-hidden /> Editar
                  </Link>
                  <form action={removeEntry}>
                    <input type="hidden" name="entity" value={entity} />
                    <input type="hidden" name="key" value={item.key} />
                    <button className="min-h-10 rounded-full px-3 text-sm text-mute hover:text-magenta">Excluir</button>
                  </form>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </AdminShell>
  );
}
