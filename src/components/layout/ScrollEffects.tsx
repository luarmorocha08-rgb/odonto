"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, MOTION_OK, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

const TONES: Record<string, string> = {
  offwhite: "#F0EEEC",
  blush: "#D8CBC6",
  taupe: "#A18D89",
  white: "#FFFFFF",
};

/**
 * Animações de scroll declarativas, aplicadas via atributos `data-*`:
 *
 * - `data-reveal="lines" | "words"` → texto revelado por linhas/palavras.
 * - `data-reveal="fade"`             → elemento sobe e aparece.
 * - `data-stagger`                   → filhos diretos aparecem em sequência.
 * - `data-mask`                      → mídia revelada por máscara (clip-path).
 * - `data-parallax="0.15"`           → deslocamento vertical relativo ao scroll.
 * - `data-tone="blush"`              → cor de fundo da página transiciona na seção.
 *
 * Tudo respeita `prefers-reduced-motion`: sem preferência por movimento, nada é
 * escondido nem animado.
 */
export function ScrollEffects() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const splits: SplitText[] = [];

        gsap.utils.toArray<HTMLElement>("[data-reveal='lines'], [data-reveal='words']").forEach((el) => {
          const type = el.dataset.reveal === "words" ? "words" : "lines";
          const split = SplitText.create(el, {
            type,
            mask: type,
            autoSplit: true,
            aria: "auto",
            onSplit: (self) =>
              gsap.from(type === "lines" ? self.lines : self.words, {
                yPercent: 115,
                duration: 1.3,
                ease: "expo.out",
                stagger: type === "lines" ? 0.1 : 0.05,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              }),
          });
          splits.push(split);
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal='fade']").forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 36,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 97%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => {
          gsap.from(el.children, {
            autoAlpha: 0,
            y: 40,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-mask]").forEach((el) => {
          const inner = el.querySelector<HTMLElement>("[data-mask-inner]");
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: "top 82%", once: true },
            // Remove o clip-path ao final para que o border-radius volte a valer.
            onComplete: () => gsap.set(el, { clearProps: "clipPath" }),
          });
          tl.fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" },
          );
          if (inner) tl.from(inner, { scale: 1.25, duration: 2, ease: "expo.out" }, 0.2);
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const speed = parseFloat(el.dataset.parallax ?? "0.15");
          gsap.fromTo(
            el,
            { yPercent: -speed * 50 },
            {
              yPercent: speed * 50,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        // Rodapé revelado como uma cortina ao final da página.
        const footer = document.querySelector<HTMLElement>("[data-footer]");
        const footerInner = footer?.querySelector<HTMLElement>("[data-footer-inner]");
        if (footer && footerInner) {
          gsap.from(footerInner, {
            yPercent: -30,
            opacity: 0.2,
            ease: "none",
            scrollTrigger: { trigger: footer, start: "top bottom", end: "bottom bottom", scrub: true },
          });
        }

        return () => splits.forEach((s) => s.revert());
      });

      // Transição de fundo entre seções — mantida mesmo com movimento reduzido,
      // porém sem tween (troca direta de cor).
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const toneSections = gsap.utils.toArray<HTMLElement>("[data-tone]");
      const setTone = (tone?: string) => {
        const color = TONES[tone ?? "offwhite"] ?? TONES.offwhite;
        gsap.to(document.body, {
          backgroundColor: color,
          duration: reduce ? 0 : 0.9,
          ease: "power2.out",
          overwrite: true,
        });
      };
      toneSections.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setTone(section.dataset.tone),
        });
      });

      // Recalcula posições após o carregamento de fontes e imagens.
      ScrollTrigger.sort();
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener("load", refresh);

      return () => {
        window.removeEventListener("load", refresh);
        gsap.set(document.body, { clearProps: "backgroundColor" });
        mm.revert();
      };
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  // Links diretos com âncora (ex.: /#contato vindo de outra página): o salto
  // nativo acontece antes de os pins existirem, então corrigimos a posição.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    let cancelled = false;
    const jump = () => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - (hash === "#inicio" ? 0 : 72);
      window.scrollTo({ top, behavior: "instant" });
    };
    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => window.setTimeout(jump, 60));
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
