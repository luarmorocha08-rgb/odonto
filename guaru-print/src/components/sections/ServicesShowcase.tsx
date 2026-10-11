"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ServiceMedia } from "@/components/ui/ServiceMedia";
import type { Service } from "@/content/types";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const ACCENT = { cyan: "#00AEEF", magenta: "#E52B91", yellow: "#F7E500" } as const;

/**
 * Serviços na home: lista tipográfica + painel de pré-visualização.
 * Passar o mouse (ou focar com o teclado) troca a categoria com transição.
 */
export function ServicesShowcase({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);
  const current = services[active];

  const select = (i: number) => {
    if (i === active) return;
    setActive(i);
    trackEvent("service_interaction", { service: services[i].slug, action: "preview", location: "home" });
  };

  return (
    <section id="servicos" className="relative py-28 md:py-36" aria-labelledby="servicos-title">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Serviços</p>
            <h2 id="servicos-title" data-split="lines" className="display-lg mt-5 max-w-3xl">
              Tudo o que a sua marca precisa para ser vista.
            </h2>
          </div>
          <Button href="/servicos" variant="ghost" ink="white" icon={<ArrowRight className="size-4" aria-hidden />}>
            Catálogo completo
          </Button>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.05fr_1fr]">
          <ol className="border-t border-white/10">
            {services.map((s, i) => (
              <li key={s.slug} className="border-b border-white/10">
                <Link
                  href={`/servicos/${s.slug}`}
                  onPointerEnter={() => select(i)}
                  onFocus={() => select(i)}
                  data-cursor="Ver"
                  className="group flex min-h-20 items-center gap-5 py-4 md:min-h-24"
                >
                  <span className="w-8 font-mono text-xs text-white/40">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className={cn(
                      "flex-1 font-display text-[clamp(1.5rem,3.4vw,2.6rem)] leading-none font-extrabold tracking-[-0.04em] transition-all duration-500",
                      i === active ? "translate-x-2 text-paper" : "text-white/35 group-hover:text-white/70",
                    )}
                  >
                    {s.name}
                  </span>
                  <span
                    className={cn("grid size-11 shrink-0 place-items-center rounded-full transition-all duration-500", i === active ? "scale-100 opacity-100" : "scale-50 opacity-0")}
                    style={{ background: ACCENT[s.accent] }}
                    aria-hidden
                  >
                    <ArrowUpRight className="size-5 text-ink" />
                  </span>
                </Link>
                {/* Mobile: resumo sempre visível do item ativo */}
                <div className={cn("grid transition-[grid-template-rows] duration-500 lg:hidden", i === active ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <p className="pb-5 pl-13 text-sm text-white/65">{s.tagline}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="relative hidden lg:block">
            <div className="sticky top-28">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.slug}
                  initial={{ opacity: 0, y: 24, clipPath: "inset(0 0 100% 0 round 28px)" }}
                  animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0 round 28px)" }}
                  exit={{ opacity: 0, y: -16, clipPath: "inset(100% 0 0% 0 round 28px)" }}
                  transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                  className="overflow-hidden rounded-[28px] border border-white/10 bg-ink-2"
                >
                  <ServiceMedia service={current} className="aspect-[16/10]" sizes="45vw" />
                  <div className="p-8">
                    <h3 className="font-display text-3xl">{current.name}</h3>
                    <p className="mt-3 text-white/70">{current.description}</p>
                    <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
                      <div>
                        <p className="font-sub text-xs font-semibold tracking-wider text-mute uppercase">Aplicações</p>
                        <ul className="mt-2 space-y-1 text-white/80">
                          {current.applications.slice(0, 4).map((a) => (
                            <li key={a}>· {a}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-sub text-xs font-semibold tracking-wider text-mute uppercase">Personalize</p>
                        <ul className="mt-2 space-y-1 text-white/80">
                          {current.customization.slice(0, 4).map((a) => (
                            <li key={a}>· {a}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Button
                        href={`/orcamento?produto=${current.quoteProduct}&servico=${current.slug}`}
                        ink={current.accent === "yellow" ? "yellow" : current.accent}
                        track={{ name: "quote_start", params: { location: "home-services", service: current.slug } }}
                      >
                        Solicitar orçamento
                      </Button>
                      <Button href={`/servicos/${current.slug}`} variant="ghost" ink="white">
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
