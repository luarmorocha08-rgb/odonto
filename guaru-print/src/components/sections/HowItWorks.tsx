"use client";

import { useRef } from "react";
import { steps } from "@/content/steps";
import { DESKTOP, gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/** Pequenos objetos "3D" (CSS) que representam cada etapa. */
function StepObject({ index }: { index: number }) {
  const common = "relative size-20 [transform-style:preserve-3d] [animation:obj-spin_9s_ease-in-out_infinite]";
  switch (index) {
    case 0: // cubo CMY — escolher o produto
      return (
        <div className={common} aria-hidden>
          {[
            ["#00AEEF", "translateZ(20px)"],
            ["#E52B91", "rotateY(90deg) translateZ(20px)"],
            ["#F7E500", "rotateX(90deg) translateZ(20px)"],
            ["#111", "rotateY(180deg) translateZ(20px)"],
            ["#0089bd", "rotateY(-90deg) translateZ(20px)"],
            ["#b8226f", "rotateX(-90deg) translateZ(20px)"],
          ].map(([c, t]) => (
            <span key={t} className="absolute inset-5 rounded-md border border-white/10" style={{ background: c, transform: t }} />
          ))}
        </div>
      );
    case 1: // régua / medidas
      return (
        <div className={common} aria-hidden>
          <span className="absolute inset-x-1 top-7 h-6 rounded bg-yellow [transform:rotateZ(-20deg)_translateZ(8px)]">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="absolute top-0 h-2.5 w-px bg-ink" style={{ left: `${10 + i * 10}%` }} />
            ))}
          </span>
        </div>
      );
    case 2: // balão de mensagem
      return (
        <div className={common} aria-hidden>
          <span className="absolute inset-3 rounded-2xl rounded-bl-sm bg-magenta [transform:translateZ(10px)]" />
          <span className="absolute top-8 left-6 flex gap-1.5 [transform:translateZ(14px)]">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2 rounded-full bg-ink" />
            ))}
          </span>
        </div>
      );
    default: // caixa de entrega
      return (
        <div className={common} aria-hidden>
          <span className="absolute inset-4 rounded-md bg-[#c08a4e] [transform:translateZ(12px)]" />
          <span className="absolute inset-y-4 left-1/2 w-2 -translate-x-1/2 bg-cyan [transform:translateZ(13px)]" />
        </div>
      );
  }
}

/** Como funciona — linha gráfica que acompanha o scroll ligando as etapas. */
export function HowItWorks() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, desktop: DESKTOP }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;
        const axis = desktop ? "scaleX" : "scaleY";
        gsap.fromTo(
          "[data-line]",
          { [axis]: 0 },
          { [axis]: 1, ease: "none", scrollTrigger: { trigger: "[data-steps]", start: "top 70%", end: "bottom 60%", scrub: true } },
        );
        gsap.utils.toArray<HTMLElement>("[data-step-item]").forEach((el) => {
          gsap.from(el, { autoAlpha: 0.15, y: 30, scrollTrigger: { trigger: el, start: "top 80%", end: "top 55%", scrub: true } });
          gsap.fromTo(
            el.querySelector("[data-step-dot]"),
            { backgroundColor: "#26262c" },
            { backgroundColor: "#ffffff", scrollTrigger: { trigger: el, start: "top 65%", toggleActions: "play none none reverse" }, duration: 0.3 },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="como-funciona" className="relative py-28 md:py-36" aria-labelledby="como-title">
      <div className="container-x">
        <p className="eyebrow">Como funciona</p>
        <h2 id="como-title" data-split="lines" className="display-lg mt-5 max-w-3xl">
          Do pedido à entrega, em quatro passos.
        </h2>

        <ol data-steps className="relative mt-16 grid gap-12 md:mt-24 lg:grid-cols-4 lg:gap-6">
          {/* linha: vertical no mobile, horizontal no desktop */}
          <span aria-hidden className="absolute top-0 bottom-0 left-[11px] w-[2px] bg-white/10 lg:top-[11px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-[2px] lg:w-auto" />
          <span
            data-line
            aria-hidden
            className="absolute top-0 bottom-0 left-[11px] w-[2px] origin-top bg-gradient-to-b from-cyan via-magenta to-yellow lg:top-[11px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-[2px] lg:w-auto lg:origin-left lg:bg-gradient-to-r"
          />
          {steps.map((s, i) => (
            <li key={s.n} data-step-item className="relative pl-12 lg:pt-14 lg:pl-0">
              <span data-step-dot aria-hidden className="absolute top-0 left-0 size-6 rounded-full border-4 border-ink bg-paper ring-1 ring-white/20" />
              <div className="mb-6 [perspective:600px]">
                <StepObject index={i} />
              </div>
              <p className="font-display text-5xl text-white/15">{s.n}</p>
              <h3 className="mt-2 font-display text-2xl">{s.title}</h3>
              <p className="mt-2 max-w-xs text-white/65">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
