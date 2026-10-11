"use client";

import { usePathname } from "next/navigation";
import { gsap, MOTION_OK, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Animações declarativas por atributo:
 * - `data-reveal`            → sobe e aparece ao entrar na tela.
 * - `data-split="lines|words|chars"` → revelação tipográfica com SplitText.
 * - `data-stagger`           → filhos diretos aparecem em sequência.
 * - `data-parallax="0.2"`    → deslocamento vertical relativo ao scroll.
 * Sem movimento liberado, tudo já aparece no estado final.
 */
export function ScrollEffects() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => el.classList.add("is-in") });
        });

        const splits: SplitText[] = [];
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          const type = (el.dataset.split as "lines" | "words" | "chars") || "lines";
          const split = SplitText.create(el, {
            type: type === "chars" ? "words,chars" : type,
            mask: type === "chars" ? "words" : type,
            autoSplit: true,
            aria: "auto",
            onSplit: (self) =>
              gsap.from(type === "lines" ? self.lines : type === "words" ? self.words : self.chars, {
                yPercent: 110,
                duration: 1.1,
                ease: "expo.out",
                stagger: type === "lines" ? 0.09 : type === "words" ? 0.045 : 0.018,
                scrollTrigger: { trigger: el, start: "top 90%", once: true },
              }),
          });
          splits.push(split);
        });

        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => {
          gsap.from(el.children, {
            autoAlpha: 0,
            y: 36,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.07,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const speed = Number(el.dataset.parallax) || 0.15;
          gsap.fromTo(
            el,
            { yPercent: -speed * 50 },
            { yPercent: speed * 50, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });

        return () => splits.forEach((s) => s.revert());
      });

      // Recalcula posições depois que fontes e imagens carregam.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
