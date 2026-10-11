"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { BeforeAfter } from "@/components/tools/BeforeAfter";
import { Dialog } from "@/components/ui/Dialog";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/config/site";
import { projectCategories } from "@/content/projects";
import type { Project, ProjectCategory } from "@/content/types";
import { cn } from "@/lib/cn";

type Filter = ProjectCategory | "todos";

const QUOTE_PRODUCT: Record<ProjectCategory, string> = { fachadas: "fachada", adesivos: "adesivo", luminosos: "luminoso", impressos: "impresso", sinalizacao: "placa" };

/** Portfólio com filtro por categoria e visualização ampliada (URL compartilhável). */
export function PortfolioGallery({ projects }: { projects: Project[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filter = (params.get("categoria") as Filter) || "todos";
  const openSlug = params.get("projeto");
  const open = projects.find((p) => p.slug === openSlug) ?? null;
  const [photo, setPhoto] = useState(0);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  const visible = filter === "todos" ? projects : projects.filter((p) => p.category === filter);
  const label = (key: string) => projectCategories.find((c) => c.key === key)?.label ?? key;

  return (
    <>
      <div role="tablist" aria-label="Filtrar projetos" className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)]">
        {projectCategories.map((c) => {
          const count = c.key === "todos" ? projects.length : projects.filter((p) => p.category === c.key).length;
          const active = filter === c.key;
          return (
            <button
              key={c.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setParam("categoria", c.key === "todos" ? null : c.key)}
              className={cn("relative min-h-11 shrink-0 rounded-full px-5 font-sub text-sm font-semibold transition", active ? "text-ink" : "text-white/70 hover:text-paper")}
            >
              {active && <motion.span layoutId="portfolio-filter" className="absolute inset-0 rounded-full bg-paper" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className="relative">
                {c.label} <span className="opacity-50">{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      <motion.ul layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 40, clipPath: "inset(20% 0 0 0 round 28px)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0 round 28px)" }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={cn(i % 5 === 0 && "lg:row-span-2")}
            >
              <button type="button" onClick={() => (setPhoto(0), setParam("projeto", p.slug))} className="group block w-full text-left" data-cursor="Ampliar">
                <div className={cn("relative overflow-hidden rounded-[1.75rem] border border-white/10", i % 5 === 0 ? "aspect-[4/5] lg:aspect-auto lg:h-[calc(100%-5.5rem)]" : "aspect-[4/3]")}>
                  <ProjectVisual project={p} className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.07]" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <p className="mt-4 font-sub text-xs font-semibold tracking-[0.18em] text-mute uppercase">{label(p.category)}</p>
                <h2 className="mt-1 font-display text-xl transition group-hover:text-cyan">{p.title}</h2>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {visible.length === 0 && <p className="mt-10 text-white/60">Ainda não há projetos nesta categoria.</p>}

      <Dialog open={Boolean(open)} onClose={() => setParam("projeto", null)} label={open?.title ?? "Projeto"} className="max-w-5xl">
        {open && (
          <div className="grid lg:grid-cols-[1.4fr_1fr]">
            <div className="relative overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
              {open.beforeImage && open.afterImage ? (
                <BeforeAfter label={open.title} before={open.beforeImage} after={open.afterImage} className="rounded-none border-0" revealOnView={false} />
              ) : open.images.length ? (
                <div className="relative aspect-[4/3] bg-ink">
                  <Image src={open.images[photo]} alt={`${open.title} — foto ${photo + 1}`} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-contain" />
                  {open.images.length > 1 && (
                    <>
                      <button type="button" onClick={() => setPhoto((photo - 1 + open.images.length) % open.images.length)} className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/60" aria-label="Foto anterior">
                        <ChevronLeft className="size-5" />
                      </button>
                      <button type="button" onClick={() => setPhoto((photo + 1) % open.images.length)} className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/60" aria-label="Próxima foto">
                        <ChevronRight className="size-5" />
                      </button>
                      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs">
                        {photo + 1} / {open.images.length}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <ProjectVisual project={open} className="aspect-[4/3]" sizes="60vw" />
              )}
            </div>
            <div className="p-6 md:p-8">
              <p className="font-sub text-xs font-semibold tracking-[0.18em] text-mute uppercase">{label(open.category)}</p>
              <h2 className="mt-2 pr-10 font-display text-3xl">{open.title}</h2>
              {open.placeholder && <p className="demo-badge mt-4">Exemplo ilustrativo</p>}
              <p className="mt-4 leading-relaxed text-white/75">{open.description}</p>
              {open.materials && open.materials.length > 0 && (
                <>
                  <p className="mt-6 font-sub text-xs font-semibold tracking-wider text-mute uppercase">Materiais</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {open.materials.map((m) => (
                      <li key={m} className="rounded-full bg-white/5 px-3 py-1 text-sm">
                        {m}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <div className="mt-8 flex flex-col gap-3">
                <WhatsAppButton location="portfolio" label="Quero algo semelhante" message={siteConfig.messages.project(open.title)} />
                <Link href={`/orcamento?produto=${QUOTE_PRODUCT[open.category]}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 font-sub text-sm font-semibold hover:border-white/40">
                  Montar orçamento <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
