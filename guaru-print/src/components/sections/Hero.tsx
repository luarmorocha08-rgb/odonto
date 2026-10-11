"use client";

import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";
import { openUi } from "@/lib/ui-events";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

type Quality = "high" | "low" | "off";

/** Decide se vale a pena carregar o WebGL e com qual qualidade. */
function detectQuality(): Quality {
  try {
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return "off";
    const canvas = document.createElement("canvas");
    if (!canvas.getContext("webgl2") && !canvas.getContext("webgl")) return "off";
    const cores = nav.hardwareConcurrency ?? 4;
    const memory = nav.deviceMemory ?? 4;
    const small = window.matchMedia("(max-width: 767px)").matches;
    if (cores <= 2 || memory <= 2) return "off";
    if (small || cores <= 4 || memory <= 4) return "low";
    return "high";
  } catch {
    return "off";
  }
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [quality, setQuality] = useState<Quality>("off");
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(true);

  // A cena 3D carrega depois do conteúdo principal (não bloqueia o LCP).
  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = () => {
      setReduced(rm);
      setQuality(detectQuality());
    };
    const idle = window.requestIdleCallback?.(start, { timeout: 1200 }) ?? window.setTimeout(start, 300);
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle as number);
      else window.clearTimeout(idle as number);
    };
  }, []);

  // Pausa a renderização quando o hero sai da tela.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create("[data-hero-title]", { type: "words,chars", mask: "words", aria: "auto" });
        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
        tl.from(split.chars, { yPercent: 115, duration: 1.2, stagger: 0.022 })
          .from("[data-hero-fade]", { autoAlpha: 0, y: 24, duration: 1, stagger: 0.1 }, "-=0.8")
          .from("[data-hero-line]", { scaleX: 0, transformOrigin: "left", duration: 1.2 }, "<");

        // Parallax: texto, fundo e cena se movem em velocidades diferentes.
        gsap.to("[data-hero-copy]", {
          yPercent: -18,
          autoAlpha: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-scene]", {
          yPercent: 12,
          scale: 0.94,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-bg]", {
          yPercent: 25,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="inicio" className="relative isolate min-h-[100svh] overflow-hidden" aria-labelledby="hero-title">
      {/* Fundo: retícula + brilhos CMY (funciona mesmo sem WebGL) */}
      <div data-hero-bg aria-hidden className="absolute inset-0 -z-20">
        <div className="halftone absolute inset-0 [mask-image:radial-gradient(ellipse_at_60%_45%,black,transparent_70%)]" />
        <div className="absolute top-[10%] right-[8%] size-[38vmax] rounded-full bg-cyan/20 blur-[120px]" />
        <div className="absolute right-[30%] bottom-[5%] size-[30vmax] rounded-full bg-magenta/20 blur-[120px]" />
        <div className="absolute top-[35%] right-[-5%] size-[18vmax] rounded-full bg-yellow/10 blur-[100px]" />
      </div>

      <div data-hero-scene aria-hidden className="absolute inset-0 -z-10 lg:left-[30%]">
        {quality !== "off" && <HeroScene quality={quality} reduced={reduced} active={active} />}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
        <div className="absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-ink to-transparent lg:block" />
      </div>

      <div className="container-x relative flex min-h-[100svh] flex-col justify-end pt-[calc(var(--header-h)+2rem)] pb-16 md:pb-20">
        <div data-hero-copy className="max-w-[60rem]">
          <p data-hero-fade className="eyebrow">
            Da ideia à impressão · {siteConfig.city} - {siteConfig.state}
          </p>
          <h1 id="hero-title" data-hero-title className="display-xl mt-6 [text-shadow:0_4px_40px_rgba(0,0,0,0.6)]">
            Sua ideia merece <span className="text-cmyk">ganhar destaque.</span>
          </h1>
          <span data-hero-line aria-hidden className="mt-8 block h-[3px] w-40 bg-gradient-to-r from-cyan via-magenta to-yellow" />
          <p data-hero-fade className="mt-6 max-w-xl font-sub text-lg leading-relaxed text-white/75 md:text-xl">
            Transformamos criatividade em impressão, comunicação visual e resultados que impressionam.
          </p>
          <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="/orcamento" size="lg" icon={<ArrowRight className="size-5" aria-hidden />} track={{ name: "quote_start", params: { location: "hero" } }}>
              Solicitar orçamento
            </Button>
            <Button href="/servicos" size="lg" variant="ghost" ink="white">
              Explorar nossos serviços
            </Button>
            <button
              type="button"
              onClick={() => openUi("assistant")}
              className="inline-flex min-h-12 items-center gap-2 rounded-full px-3 font-sub text-sm font-semibold text-white/70 transition hover:text-paper"
            >
              <Sparkles className="size-4 text-yellow" aria-hidden /> Preciso de ajuda para escolher
            </button>
          </div>
          <ul data-hero-fade className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/60">
            <li>
              <strong className="font-display text-2xl text-paper">{siteConfig.highlights.ordersDelivered}</strong>
              <span className="block">pedidos entregues</span>
            </li>
            <li>
              <strong className="font-display text-2xl text-paper">{siteConfig.yearsActive} anos</strong>
              <span className="block">de experiência</span>
            </li>
            <li>
              <strong className="font-display text-2xl text-paper">Brasil</strong>
              <span className="block">envio para todo o país</span>
            </li>
          </ul>
        </div>

        <a
          href="#impressao"
          className="absolute right-[var(--gutter)] bottom-16 hidden flex-col items-center gap-3 text-[0.7rem] font-semibold tracking-[0.2em] text-white/50 uppercase transition hover:text-paper md:flex"
          aria-label="Rolar para a próxima seção"
        >
          <span className="relative flex h-11 w-7 justify-center rounded-full border border-white/30 pt-2">
            <span className="size-1.5 rounded-full bg-paper [animation:scroll-dot_1.8s_ease-in-out_infinite]" />
          </span>
          Role
          <ArrowDown className="size-4" aria-hidden />
        </a>
      </div>
    </section>
  );
}
