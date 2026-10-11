"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/**
 * Animação 2 — Adesivo sendo aplicado.
 * O scroll descola o liner (papel de proteção) da esquerda para a direita,
 * revelando a arte sobre uma vitrine de vidro. Um brilho de vinil percorre a
 * superfície ao final e a categoria aparece.
 */
export function StickerApply() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const state = { p: 0 };
        const art = q("[data-art]")[0] as HTMLElement;
        const liner = q("[data-liner]")[0] as HTMLElement;
        const curl = q("[data-curl]")[0] as HTMLElement;
        const apply = () => {
          const p = state.p * 100;
          art.style.clipPath = `inset(0 ${100 - p}% 0 0 round 18px)`;
          liner.style.clipPath = `inset(0 0 0 ${p}% round 18px)`;
          curl.style.left = `${p}%`;
          curl.style.opacity = state.p > 0.01 && state.p < 0.99 ? "1" : "0";
        };
        apply();

        gsap.set(q("[data-label]"), { autoAlpha: 0, y: 30 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=220%", scrub: 0.8, pin: q("[data-pin]")[0] },
        });
        tl.fromTo(q("[data-glass]"), { rotateY: -22, rotateX: 8 }, { rotateY: -8, rotateX: 4, duration: 3 }, 0)
          .from(q("[data-hand]"), { autoAlpha: 0, x: -40, duration: 0.3 }, 0.1)
          .to(state, { p: 1, duration: 2, ease: "power1.inOut", onUpdate: apply }, 0.3)
          .to(q("[data-hand]"), { left: "100%", duration: 2, ease: "power1.inOut" }, 0.3)
          .to(q("[data-hand]"), { autoAlpha: 0, duration: 0.2 }, 2.3)
          .fromTo(q("[data-gloss]"), { xPercent: -120 }, { xPercent: 260, duration: 0.8, ease: "power2.inOut" }, 2.4)
          .to(q("[data-label]"), { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 2.6)
          .to({}, { duration: 0.4 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative" aria-labelledby="adesivo-title">
      <div data-pin className="relative flex min-h-[100svh] items-center overflow-hidden py-24">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_50%,rgba(229,43,145,0.14),transparent_60%)]" />
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          {/* Vitrine */}
          <div className="order-2 [perspective:1600px] lg:order-1">
            <div
              data-glass
              className="relative mx-auto aspect-[4/3] w-full max-w-[38rem] rounded-[28px] border border-white/15 bg-gradient-to-br from-[#2a3440]/80 via-[#141a22]/80 to-[#0b0e13]/90 p-[7%] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.18)] [transform-style:preserve-3d] [transform:rotateY(-8deg)_rotateX(4deg)]"
            >
              {/* reflexos do vidro */}
              <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[28px] bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.12)_28%,transparent_36%,transparent_60%,rgba(255,255,255,0.06)_66%,transparent_72%)]" />
              <div className="relative h-full">
                {/* Liner (papel de proteção) */}
                <div data-liner className="absolute inset-0 rounded-[18px] bg-[repeating-linear-gradient(135deg,#e9e9ee_0_14px,#dcdce3_14px_28px)] shadow-inner">
                  <span className="absolute inset-0 grid place-items-center font-sub text-xs font-semibold tracking-[0.3em] text-black/30 uppercase">
                    Papel de proteção
                  </span>
                </div>
                {/* Arte do adesivo */}
                <div data-art className="absolute inset-0 overflow-hidden rounded-[18px] bg-magenta" style={{ clipPath: "inset(0 0% 0 0 round 18px)" }}>
                  <div className="absolute -top-1/4 -right-[12%] size-[70%] rounded-full bg-yellow mix-blend-multiply" />
                  <div className="absolute -bottom-1/3 -left-[10%] size-[65%] rounded-full bg-cyan mix-blend-multiply" />
                  <div className="relative flex h-full flex-col justify-between p-[7%]">
                    <p className="font-sub text-[clamp(0.6rem,1.3vw,0.8rem)] font-semibold tracking-[0.3em] text-ink uppercase">Vitrine · 2026</p>
                    <p className="font-display text-[clamp(1.8rem,5.5vw,4.2rem)] leading-[0.85] font-extrabold tracking-[-0.05em] text-ink uppercase italic">
                      Nova
                      <br />
                      coleção
                    </p>
                    <p className="font-sub text-[clamp(0.7rem,1.6vw,1rem)] font-semibold text-ink">Vinil impresso · recorte no contorno</p>
                  </div>
                  <div data-gloss aria-hidden className="absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent mix-blend-overlay" />
                </div>
                {/* Dobra do liner sendo puxado */}
                <div
                  data-curl
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 w-[12%] -translate-x-1/2 rounded-r-[40%] bg-gradient-to-r from-white via-[#d4d4dc] to-[#8a8a96] opacity-0 shadow-[-12px_0_24px_rgba(0,0,0,0.35)]"
                />
                {/* Espátula */}
                <div data-hand aria-hidden className="absolute top-[38%] left-0 z-10 h-[24%] w-5 -translate-x-1/2 rounded-md bg-gradient-to-b from-cyan to-[#0079a8] shadow-lg motion-reduce:hidden" />
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="eyebrow">Aplicação</p>
            <h2 id="adesivo-title" className="display-lg mt-5">
              Descola, aplica, <span className="text-cmyk">transforma.</span>
            </h2>
            <p className="mt-5 max-w-md text-white/65">
              Vitrines, paredes, veículos e embalagens ganham vida com vinil impresso ou recortado, no formato exato do seu projeto.
            </p>
            <div data-label className="mt-10">
              <p className="font-display text-3xl font-extrabold md:text-4xl">Adesivos personalizados</p>
              <Link
                href="/servicos/adesivos-personalizados"
                className="group mt-4 inline-flex min-h-11 items-center gap-2 font-sub font-semibold text-magenta"
                data-cursor="Ver"
              >
                Conhecer opções de adesivos
                <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
