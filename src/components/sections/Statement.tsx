"use client";

import { useRef } from "react";
import { images } from "@/content/images";
import { Media } from "@/components/ui/Media";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/**
 * Seção-manifesto com "scale transition": a fotografia cresce até ocupar a
 * tela enquanto a seção permanece fixada.
 */
export function Statement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        const narrow = window.innerWidth < 768;
        tl.fromTo(
          "[data-statement-frame]",
          { clipPath: narrow ? "inset(22% 14% 22% 14% round 400px)" : "inset(24% 32% 24% 32% round 400px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)" },
        )
          .fromTo("[data-statement-image]", { scale: 1.35 }, { scale: 1 }, 0)
          .to("[data-statement-top]", { yPercent: -120, autoAlpha: 0 }, 0)
          .to("[data-statement-bottom]", { yPercent: 120, autoAlpha: 0 }, 0)
          .from("[data-statement-caption]", { autoAlpha: 0, y: 40, duration: 0.35 }, 0.65);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Nossa filosofia" data-tone="offwhite" className="relative h-[100svh] overflow-hidden">
      <div data-statement-frame className="absolute inset-0 overflow-hidden">
        <div data-statement-image className="absolute inset-0">
          <Media asset={images.statement} sizes="100vw" tone="deep" />
        </div>
        <div aria-hidden className="absolute inset-0 z-[2] bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] hidden flex-col [.motion-ok_&]:flex items-center justify-between py-[12svh] text-center">
        <p data-statement-top className="font-display text-headline font-extralight tracking-[-0.03em]">
          Menos excesso.
        </p>
        <p data-statement-bottom className="font-display text-headline font-light tracking-[-0.03em] text-taupe-deep italic">
          Mais você.
        </p>
      </div>

      <div data-statement-caption className="absolute inset-x-0 bottom-0 z-[3] pb-14 text-offwhite md:pb-20">
        <div className="container-lux grid gap-6 md:grid-cols-12">
          <h2 className="font-display text-title font-extralight md:col-span-6">
            Menos excesso. <em className="italic">Mais você.</em>
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-offwhite/85 md:col-span-5 md:col-start-8 md:text-base">
            Cada plano nasce da escuta e do respeito às suas características. O objetivo é que você se reconheça no
            espelho — só que ainda mais à vontade com o próprio sorriso.
          </p>
        </div>
      </div>
    </section>
  );
}
