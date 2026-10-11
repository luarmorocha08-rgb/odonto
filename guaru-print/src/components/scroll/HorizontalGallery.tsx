"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import { projectCategories } from "@/content/projects";
import type { Project } from "@/content/types";
import { DESKTOP, gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

const categoryLabel = (key: string) => projectCategories.find((c) => c.key === key)?.label ?? key;

/**
 * Animação 5 — Galeria horizontal.
 * Desktop: o scroll vertical move a galeria na horizontal, com profundidade.
 * Mobile/movimento reduzido: rolagem horizontal nativa com snap (acessível ao toque).
 */
export function HorizontalGallery({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-card]", el).forEach((card) => {
          gsap.fromTo(
            card.querySelector("[data-card-media]"),
            { scale: 1.18, xPercent: -8 },
            { scale: 1, xPercent: 8, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
          );
          gsap.fromTo(
            card,
            { rotateY: -14, z: -120, autoAlpha: 0.4 },
            { rotateY: 0, z: 0, autoAlpha: 1, ease: "power2.out", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 95%", end: "left 45%", scrub: true } },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden py-20 lg:flex lg:h-[100svh] lg:items-center lg:py-0" aria-labelledby="projetos-title">
      <div
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-4 [perspective:1600px] lg:snap-none lg:overflow-visible lg:pb-0 motion-reduce:lg:overflow-x-auto"
      >
        <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-center pr-6 sm:w-[60vw] lg:w-[34vw]">
          <p className="eyebrow">Portfólio</p>
          <h2 id="projetos-title" className="display-lg mt-5">
            Projetos que <span className="text-cmyk">saem do papel.</span>
          </h2>
          <p className="mt-5 max-w-sm text-white/65">
            Fachadas, adesivos, luminosos, impressos e sinalização. Os itens marcados como exemplo serão substituídos por trabalhos reais.
          </p>
          <Link href="/portfolio" className="group mt-8 inline-flex min-h-11 items-center gap-2 font-sub font-semibold">
            Ver portfólio completo <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>

        {projects.map((p, i) => (
          <article
            key={p.slug}
            data-card
            className="group relative flex w-[82vw] shrink-0 snap-start flex-col sm:w-[55vw] lg:w-[38vw] [transform-style:preserve-3d]"
          >
            <Link href={`/portfolio?projeto=${p.slug}`} className="block" data-cursor="Ver" aria-label={`Ver detalhes: ${p.title}`}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/10 lg:aspect-[5/6]">
                <div data-card-media className="absolute inset-0">
                  <ProjectVisual project={p} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
                </div>
                <span className="absolute right-4 bottom-4 grid size-12 place-items-center rounded-full bg-paper text-ink opacity-0 transition duration-500 group-hover:opacity-100" aria-hidden>
                  <ArrowUpRight className="size-5" />
                </span>
              </div>
            </Link>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-sub text-xs font-semibold tracking-[0.18em] text-mute uppercase">
                  {String(i + 1).padStart(2, "0")} · {categoryLabel(p.category)}
                </p>
                <h3 className="mt-2 font-display text-2xl">{p.title}</h3>
                <p className="mt-2 line-clamp-2 max-w-md text-sm text-white/60">{p.description}</p>
              </div>
            </div>
            <Link href={`/portfolio?projeto=${p.slug}`} className="mt-3 inline-flex min-h-11 items-center gap-2 self-start font-sub text-sm font-semibold text-cyan">
              Visualizar detalhes <ArrowRight className="size-4" aria-hidden />
            </Link>
          </article>
        ))}
        <div className="w-[var(--gutter)] shrink-0" aria-hidden />
      </div>
    </section>
  );
}
