import { ArrowUpRight, BookOpen, Calculator, Wand2 } from "lucide-react";
import Link from "next/link";

const TOOLS = [
  { href: "/simulador", icon: Wand2, title: "Simulador visual", text: "Veja sua arte aplicada em adesivo, banner, placa, fachada ou cavalete.", cta: "Personalizar produto", color: "#E52B91" },
  { href: "/orcamento#calculadora", icon: Calculator, title: "Calculadora de medidas", text: "Área em m², conversões e proporção — e leve as medidas para o orçamento.", cta: "Calcular medidas", color: "#F7E500" },
  { href: "/guia-de-impressao", icon: BookOpen, title: "Guia de impressão", text: "Resolução, sangria, CMYK e formatos: prepare seu arquivo do jeito certo.", cta: "Ler o guia", color: "#00AEEF" },
];

export function ToolsTeaser() {
  return (
    <section className="relative py-24 md:py-32" aria-labelledby="tools-title">
      <div className="container-x">
        <p className="eyebrow">Ferramentas</p>
        <h2 id="tools-title" data-split="lines" className="display-lg mt-5 max-w-3xl">
          Planeje seu pedido antes de falar com a gente.
        </h2>
        <ul data-stagger className="mt-14 grid gap-4 md:grid-cols-3">
          {TOOLS.map(({ href, icon: Icon, title, text, cta, color }) => (
            <li key={href}>
              <Link href={href} data-cursor="Abrir" className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-2 p-8 transition hover:border-white/30">
                <span aria-hidden className="absolute -top-16 -right-16 size-40 rounded-full opacity-20 blur-2xl transition-transform duration-700 group-hover:scale-150" style={{ background: color }} />
                <Icon className="size-8" style={{ color }} aria-hidden />
                <h3 className="mt-10 font-display text-2xl">{title}</h3>
                <p className="mt-3 flex-1 text-white/65">{text}</p>
                <span className="mt-8 inline-flex items-center gap-2 font-sub text-sm font-semibold">
                  {cta} <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
