"use client";

import { ArrowRight, ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { ServiceMedia } from "@/components/ui/ServiceMedia";
import type { Service } from "@/content/types";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const ACCENT = { cyan: "#00AEEF", magenta: "#E52B91", yellow: "#F7E500" } as const;

/** Card com profundidade 3D, reflexo que acompanha o cursor e informações expansíveis. */
export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const color = ACCENT[service.accent];

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 12}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <div className="[perspective:1200px]">
      <article
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-2 transition-[transform,border-color] duration-300 ease-out [transform:rotateX(var(--rx,0))_rotateY(var(--ry,0))] [transform-style:preserve-3d] hover:border-white/25 motion-reduce:[transform:none]"
        style={{ "--accent": color } as React.CSSProperties}
      >
        {/* reflexo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(500px circle at var(--mx,50%) var(--my,0%), rgba(255,255,255,0.12), transparent 40%)" }}
        />
        <Link
          href={`/servicos/${service.slug}`}
          className="block"
          data-cursor="Ver"
          onClick={() => trackEvent("service_interaction", { service: service.slug, action: "open", location: "card" })}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <ServiceMedia service={service} className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
            <span className="absolute top-4 left-4 font-display text-sm text-white/70">{String(index + 1).padStart(2, "0")}</span>
          </div>
          <div className="p-6 pb-3 [transform:translateZ(30px)]">
            <h3 className="font-display text-2xl">
              {service.name}
              <span className="ml-2 inline-block size-2 rounded-full align-middle" style={{ background: color }} aria-hidden />
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/65">{service.tagline}</p>
          </div>
        </Link>

        <div className="mt-auto px-6 pb-6">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-paper"
          >
            {open ? "Menos detalhes" : "Aplicações e opções"}
            <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
          </button>
          <div className={cn("grid transition-[grid-template-rows] duration-500 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
            <div className="overflow-hidden">
              <div className="grid gap-4 pt-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="font-sub text-xs font-semibold tracking-wider text-mute uppercase">Aplicações comuns</p>
                  <ul className="mt-2 space-y-1 text-white/75">
                    {service.applications.slice(0, 4).map((a) => (
                      <li key={a}>· {a}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-sub text-xs font-semibold tracking-wider text-mute uppercase">Personalização</p>
                  <ul className="mt-2 space-y-1 text-white/75">
                    {service.customization.slice(0, 4).map((a) => (
                      <li key={a}>· {a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/orcamento?produto=${service.quoteProduct}&servico=${service.slug}`}
              onClick={() => trackEvent("quote_start", { service: service.slug, location: "service-card" })}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-paper px-5 font-sub text-sm font-semibold text-ink transition hover:bg-[var(--accent)]"
            >
              <Plus className="size-4" aria-hidden /> Solicitar orçamento
            </Link>
            <Link
              href={`/servicos/${service.slug}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 font-sub text-sm font-semibold hover:border-white/40"
              aria-label={`Ver detalhes de ${service.name}`}
            >
              Detalhes <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
