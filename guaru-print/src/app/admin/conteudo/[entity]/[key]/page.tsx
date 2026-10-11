import { notFound } from "next/navigation";
import { AdminShell, DemoNotice } from "@/components/admin/AdminShell";
import { EntryForm } from "@/components/admin/EntryForm";
import { ENTITIES, isEntityKey, type AdminField } from "@/lib/admin/entities";
import { requireAdmin } from "@/lib/admin/guard";
import { getEntry } from "@/lib/admin/repo";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function EntityEdit({ params }: { params: Promise<{ entity: string; key: string }> }) {
  await requireAdmin();
  const { entity, key } = await params;
  if (!isEntityKey(entity)) notFound();
  const def = ENTITIES[entity];
  const isNew = key === "novo";
  const entry = isNew ? null : await getEntry(entity, decodeURIComponent(key));
  if (!isNew && !entry) notFound();
  const db = isSupabaseConfigured();
  return (
    <AdminShell title={isNew ? `Novo ${def.singular}` : `Editar ${def.singular}`}>
      {!db && <DemoNotice configured={false} />}
      <EntryForm
        entity={entity}
        fields={def.fields as readonly AdminField[]}
        data={entry?.data ?? { order: 99, accent: "cyan", placeholder: false }}
        published={entry?.published ?? true}
        previousKey={isNew ? "" : (entry?.key ?? "")}
        disabled={!db}
      />
    </AdminShell>
  );
}
