"use client";

import { useRef } from "react";
import { images } from "@/content/images";
import { ButtonLink, WhatsAppCta } from "@/components/ui/CtaLink";
import { Media } from "@/components/ui/Media";
import { RotatingBadge } from "@/components/ui/RotatingBadge";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";
import { scrollToHash, useLenis } from "@/components/layout/SmoothScroll";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const title = root.current!.querySelector<HTMLElement>("[data-hero-title]")!;
        const media = root.current!.querySelector<HTMLElement>("[data-hero-media]")!;
        const mediaInner = media.querySelector<HTMLElement>("[data-hero-media-inner]");
        // Fora do escopo da seção: elementos do cabeçalho.
        const headerItems = Array.from(document.querySelectorAll<HTMLElement>("header [data-hero-fade]"));
        const fades = gsap.utils.toArray<HTMLElement>("[data-hero-fade]", root.current);

        const split = SplitText.create(title, { type: "words", mask: "words", aria: "auto" });

        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
        tl.set([title, media, ...headerItems, ...fades], { visibility: "visible" })
          // 1. Logotipo e menu surgem suavemente
          .from(headerItems, { autoAlpha: 0, y: -12, duration: 1.2, stagger: 0.08 })
          // 2. Título palavra por palavra
          .from(split.words, { yPercent: 115, duration: 1.4, stagger: 0.07 }, 0.25)
          // 3 e 4. Fotografia sobe e é revelada por máscara
          .fromTo(
            media,
            { clipPath: "inset(100% 0% 0% 0% round 999px 999px 0px 0px)", y: 80 },
            { clipPath: "inset(0% 0% 0% 0% round 999px 999px 0px 0px)", y: 0, duration: 1.8, ease: "expo.inOut" },
            0.35,
          )
          .from(mediaInner, { scale: 1.35, duration: 2.4 }, 0.6)
          // 5 e 6. Textos de apoio, botões e indicação de scroll com leve atraso
          .from(fades, { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.1 }, 1.05);

        // Parallax discreto na fotografia principal
        gsap.to("[data-hero-parallax]", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section
      id="inicio"
      ref={root}
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-end overflow-hidden pt-28 pb-10 md:pt-36 md:pb-14"
    >
      {/* Elementos de linha fina ao fundo */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-[58%] hidden h-full w-px bg-ink/[0.07] lg:block" />
        <div className="absolute -top-[30vw] -left-[20vw] size-[70vw] rounded-full border border-ink/[0.06]" />
      </div>

      <div className="container-lux relative grid w-full items-end gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7 lg:pb-10">
          <p data-hero-fade className="eyebrow mb-6 flex items-center gap-3 text-taupe-deep md:mb-8">
            <span className="h-px w-10 bg-current" />
            Odontologia estética · Santos — SP
          </p>

          <h1
            id="hero-title"
            data-hero-title
            className="font-display text-display font-extralight tracking-[-0.035em] text-balance"
          >
            Realce sua beleza. <em className="font-light text-taupe-deep italic">Preserve sua essência.</em>
          </h1>

          <p data-hero-fade className="mt-7 max-w-md text-[0.95rem] leading-relaxed text-ink/75 md:mt-9 md:text-base">
            Odontologia estética e harmonização facial com naturalidade, equilíbrio e cuidado em cada detalhe.
          </p>

          <div data-hero-fade className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-11">
            <WhatsAppCta location="hero">Agendar minha avaliação</WhatsAppCta>
            <ButtonLink
              href="/#tratamentos"
              variant="outline"
              onClick={(e) => {
                if (scrollToHash("#tratamentos", lenis)) e.preventDefault();
              }}
            >
              Conhecer tratamentos
            </ButtonLink>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div
            data-hero-media
            className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-t-full rounded-b-[28px] lg:max-h-[calc(100svh-11rem)]"
          >
            <div data-hero-parallax className="absolute -inset-y-[8%] inset-x-0">
              <div data-hero-media-inner className="absolute inset-0">
                <Media asset={images.hero} sizes="(min-width: 1024px) 40vw, 100vw" priority />
              </div>
            </div>
          </div>

          <div data-hero-fade className="absolute -top-6 -left-2 hidden md:block lg:-left-14">
            <RotatingBadge text="Harmonização facial • Odontologia estética • " />
          </div>

          <div
            data-hero-fade
            className="absolute -bottom-4 left-4 max-w-[15rem] rounded-2xl border border-white/60 bg-white/70 p-4 shadow-[0_20px_50px_-30px_rgba(37,37,37,0.45)] backdrop-blur-md sm:left-auto sm:-right-2 lg:-left-16 lg:right-auto lg:bottom-16"
          >
            <p className="eyebrow text-taupe-deep">Nossa assinatura</p>
            <p className="mt-2 font-display text-lg leading-snug font-light">Resultados naturais, sem exageros.</p>
          </div>
        </div>
      </div>

      <div
        data-hero-fade
        aria-hidden
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
      >
        <span className="eyebrow text-[0.6rem] text-ink/60 [writing-mode:vertical-rl]">Role</span>
        <span className="relative block h-14 w-px overflow-hidden bg-ink/10">
          <span className="animate-scroll-cue absolute inset-0 bg-ink" />
        </span>
      </div>
    </section>
  );
}
