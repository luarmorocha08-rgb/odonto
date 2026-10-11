import { CheckCircle2, CircleDashed } from "lucide-react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { siteConfig } from "@/config/site";
import { requireAdmin } from "@/lib/admin/guard";
import { listEntries, listQuotes } from "@/lib/admin/repo";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function AdminHome() {
  await requireAdmin();
  const supabase = isSupabaseConfigured();
  const [quotes, services, projects, faq] = await Promise.all([listQuotes().catch(() => null), listEntries("service"), listEntries("project"), listEntries("faq")]);
  const fresh = quotes?.filter((q) => q.status === "novo").length ?? 0;
  const checks = [
    { label: "Supabase (banco e arquivos)", ok: supabase, hint: "NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY" },
    { label: "WhatsApp", ok: Boolean(siteConfig.whatsapp.number), hint: siteConfig.whatsapp.display },
    { label: "Google Analytics 4", ok: Boolean(siteConfig.analytics.ga4Id), hint: "NEXT_PUBLIC_GA4_ID (opcional)" },
    { label: "Meta Pixel", ok: Boolean(siteConfig.analytics.metaPixelId), hint: "NEXT_PUBLIC_META_PIXEL_ID (opcional)" },
  ];
  const stats = [
    { label: "Orçamentos novos", value: quotes ? fresh : "—", href: "/admin/orcamentos" },
    { label: "Serviços", value: services.items.length, href: "/admin/conteudo/service", demo: services.source === "demo" },
    { label: "Projetos", value: projects.items.length, href: "/admin/conteudo/project", demo: projects.source === "demo" },
    { label: "Perguntas", value: faq.items.length, href: "/admin/conteudo/faq", demo: faq.source === "demo" },
  ];
  return (
    <AdminShell title="Painel">
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="card block p-6 hover:border-white/30">
              <p className="text-sm text-mute">{s.label}</p>
              <p className="mt-2 font-display text-4xl">{s.value}</p>
              {s.demo && <p className="demo-badge mt-3">demonstrativo</p>}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mt-12 font-sub font-semibold">Integrações</h2>
      <ul className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10">
        {checks.map((c) => (
          <li key={c.label} className="flex items-center gap-3 p-4 text-sm">
            {c.ok ? <CheckCircle2 className="size-5 text-[#25D366]" aria-hidden /> : <CircleDashed className="size-5 text-mute" aria-hidden />}
            <span className="flex-1">{c.label}</span>
            <span className="text-xs text-mute">{c.ok ? "Configurado" : c.hint}</span>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
