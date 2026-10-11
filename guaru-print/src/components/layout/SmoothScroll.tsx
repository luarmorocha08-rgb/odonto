"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { gsap, MOTION_OK, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

/**
 * Smooth scrolling com Lenis sincronizado ao ticker do GSAP.
 * Desativado automaticamente quando o visitante prefere movimento reduzido.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const media = window.matchMedia(MOTION_OK);
    let instance: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    const start = () => {
      instance = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Toque usa o scroll nativo — mais natural e performático no celular.
        syncTouch: false,
      });
      instance.on("scroll", ScrollTrigger.update);
      tick = (time: number) => instance?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(instance);
    };

    const stop = () => {
      if (tick) gsap.ticker.remove(tick);
      instance?.destroy();
      instance = null;
      setLenis(null);
    };

    if (media.matches) start();
    const onChange = () => (media.matches ? start() : stop());
    media.addEventListener("change", onChange);

    return () => {
      media.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/** Rola até uma âncora usando Lenis quando disponível. */
export function scrollToHash(hash: string, lenis: Lenis | null) {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return false;
  if (lenis) {
    lenis.scrollTo(target, { offset: -72, duration: 1.4 });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  // Move o foco para a seção, preservando a navegação por teclado.
  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  history.replaceState(null, "", hash);
  return true;
}
