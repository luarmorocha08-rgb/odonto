import { Download } from "lucide-react";
import Link from "next/link";
import { setQuoteStatus } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/guard";
import { listQuotes } from "@/lib/admin/repo";
import { describeItem } from "@/lib/quote/message";
import type { QuoteItem } from "@/lib/quote/products";
import { BUCKETS, getSupabaseAdmin } from "@/lib/supabase/server";

const STATUSES = [
  ["novo", "Novo"],
  ["em-analise", "Em análise"],
  ["respondido", "Respondido"],
  ["aprovado", "Aprovado"],
  ["concluido", "Concluído"],
  ["arquivado", "Arquivado"],
] as const;

export default async function QuotesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const { status } = await searchParams;
  const quotes = await listQuotes(status).catch((e: Error) => e);
  const supabase = getSupabaseAdmin();

  if (!quotes) {
    return (
      <AdminShell title="Orçamentos">
        <p className="max-w-xl text-white/70">As solicitações chegam pelo WhatsApp. Para também guardá-las aqui (com as artes em armazenamento privado), configure o Supabase conforme o README.</p>
      </AdminShell>
    );
  }
  if (quotes instanceof Error) {
    return (
      <AdminShell title="Orçamentos">
        <p className="text-magenta">Erro ao carregar: {quotes.message}</p>
      </AdminShell>
    );
  }

  // Links assinados de 1 hora para as artes (bucket privado).
  const links = new Map<string, string>();
  for (const q of quotes) {
    for (const path of q.files ?? []) {
      const { data } = await supabase!.storage.from(BUCKETS.quoteFiles).createSignedUrl(path, 3600);
      if (data?.signedUrl) links.set(path, data.signedUrl);
    }
  }

  return (
    <AdminShell title="Orçamentos">
      <nav aria-label="Filtrar por status" className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        <Link href="/admin/orcamentos" className={`min-h-9 rounded-full px-4 py-2 text-sm ${!status ? "bg-paper text-ink" : "bg-white/5"}`}>
          Todos
        </Link>
        {STATUSES.map(([v, l]) => (
          <Link key={v} href={`/admin/orcamentos?status=${v}`} className={`min-h-9 rounded-full px-4 py-2 text-sm whitespace-nowrap ${status === v ? "bg-paper text-ink" : "bg-white/5"}`}>
            {l}
          </Link>
        ))}
      </nav>
      {quotes.length === 0 && <p className="text-white/60">Nenhuma solicitação.</p>}
      <ul className="space-y-4">
        {quotes.map((q) => {
          const c = q.customer as { name?: string; whatsapp?: string; email?: string; city?: string; cep?: string; notes?: string; needsDesign?: boolean };
          return (
            <li key={q.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm text-cyan">{q.reference}</p>
                  <p className="mt-1 font-semibold">{c.name}</p>
                  <p className="text-sm text-mute">
                    <a className="underline" href={`https://wa.me/55${String(c.whatsapp ?? "").replace(/^55/, "")}`} target="_blank" rel="noopener noreferrer">
                      {c.whatsapp}
                    </a>
                    {c.email && ` · ${c.email}`} · {c.city}
                    {c.cep && ` · CEP ${c.cep}`}
                  </p>
                  <p className="text-xs text-mute">{new Date(q.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}</p>
                </div>
                <form action={setQuoteStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={q.id} />
                  <select name="status" defaultValue={q.status} className="field min-h-10 py-1 text-sm" aria-label="Status">
                    {STATUSES.map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <button className="min-h-10 rounded-full bg-white/10 px-4 text-sm">Salvar</button>
                </form>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {(q.items as QuoteItem[]).map((item, i) => {
                  const d = describeItem(item);
                  return (
                    <div key={i} className="rounded-xl bg-ink p-3 text-sm">
                      <p className="font-semibold">{d.title}</p>
                      <ul className="mt-1 text-white/70">
                        {d.lines.map((l) => (
                          <li key={l.label}>
                            {l.label}: {l.value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              {c.needsDesign && <p className="mt-3 text-sm text-yellow">Precisa de criação/ajuste de arte</p>}
              {c.notes && <p className="mt-3 text-sm text-white/75">Obs.: {c.notes}</p>}
              {(q.files?.length ?? 0) > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {q.files.map((p) => (
                    <li key={p}>
                      <a href={links.get(p)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-2 rounded-full bg-white/5 px-3 text-xs hover:bg-white/10">
                        <Download className="size-3.5" aria-hidden /> {p.split("/").pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </AdminShell>
  );
}
