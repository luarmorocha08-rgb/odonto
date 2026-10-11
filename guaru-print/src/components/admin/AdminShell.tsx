import { ExternalLink, FileText, HelpCircle, Image as ImageIcon, LayoutDashboard, LogOut, Package, Settings } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/admin/actions";
import { Logo } from "@/components/ui/Logo";

const NAV = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard },
  { href: "/admin/orcamentos", label: "Orçamentos", icon: FileText },
  { href: "/admin/conteudo/service", label: "Serviços", icon: Package },
  { href: "/admin/conteudo/project", label: "Projetos", icon: ImageIcon },
  { href: "/admin/conteudo/faq", label: "Perguntas frequentes", icon: HelpCircle },
  { href: "/admin/conteudo/settings", label: "Informações comerciais", icon: Settings },
];

export function AdminShell({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-white/10 bg-ink-2 p-5 lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between lg:block">
          <Link href="/admin" className="text-lg">
            <Logo />
          </Link>
          <p className="mt-1 hidden text-xs text-mute lg:block">Painel administrativo</p>
        </div>
        <nav aria-label="Painel" className="mt-4 lg:mt-8">
          <ul className="no-scrollbar flex gap-1 overflow-x-auto lg:flex-col">
            {NAV.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm whitespace-nowrap text-white/75 hover:bg-white/5 hover:text-paper">
                  <Icon className="size-4" aria-hidden /> {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6 hidden space-y-1 border-t border-white/10 pt-4 lg:block">
          <Link href="/" target="_blank" className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm text-mute hover:text-paper">
            <ExternalLink className="size-4" aria-hidden /> Ver site
          </Link>
          <form action={logout}>
            <button type="submit" className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-mute hover:text-paper">
              <LogOut className="size-4" aria-hidden /> Sair
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 p-5 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl">{title}</h1>
          {actions}
        </div>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}

export function DemoNotice({ configured }: { configured: boolean }) {
  return (
    <div className="mb-6 rounded-2xl border border-yellow/30 bg-yellow/5 p-4 text-sm text-white/80">
      {configured ? (
        <>Exibindo <strong className="text-yellow">dados demonstrativos</strong>. Use “Importar para o banco” para começar a editar.</>
      ) : (
        <>
          <strong className="text-yellow">Modo demonstração:</strong> o Supabase ainda não está configurado, então os dados abaixo vêm de <code>src/content</code> e não podem ser editados aqui. Veja o README para conectar o banco.
        </>
      )}
    </div>
  );
}
