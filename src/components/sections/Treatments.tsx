"use client";

import Link from "next/link";
import { useRef } from "react";
import { publishedTreatments } from "@/content/treatments";
import { WhatsAppCta } from "@/components/ui/CtaLink";
import { Media } from "@/components/ui/Media";
import { trackEvent } from "@/lib/analytics";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

export function Treatments() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: navegação horizontal durante parte do scroll.
      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        const distance = () => track.current!.scrollWidth - viewport.current!.clientWidth;

        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        gsap.to("[data-treatments-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // Leve profundidade: imagens deslizam dentro dos cards.
        gsap.utils.toArray<HTMLElement>("[data-card-image]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: img.closest("li"),
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });

        // Acessibilidade: ao navegar por teclado, rola até o card focado.
        const onFocus = (event: FocusEvent) => {
          const card = (event.target as HTMLElement).closest("li");
          const st = tween.scrollTrigger;
          if (!card || !st) return;
          viewport.current!.scrollLeft = 0;
          const progress = gsap.utils.clamp(0, 1, (card.offsetLeft - 48) / distance());
          window.scrollTo({ top: st.start + progress * (st.end - st.start), behavior: "instant" });
        };
        track.current!.addEventListener("focusin", onFocus);
        return () => track.current?.removeEventListener("focusin", onFocus);
      });

      // Mobile/tablet: cards surgem em sequência.
      mm.add(`(max-width: 1023px) and ${MOTION_OK}`, () => {
        gsap.utils.toArray<HTMLElement>("[data-treatment-card]").forEach((card) => {
          gsap.from(card, {
            autoAlpha: 0,
            y: 50,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="tratamentos"
      ref={root}
      aria-labelledby="tratamentos-title"
      data-tone="blush"
      data-hide-float
      className="relative overflow-hidden py-24 md:py-32 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:pt-20 lg:pb-6"
    >
      <div className="container-lux">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-5 flex items-center gap-3 text-taupe-deep">
              <span className="h-px w-10 bg-current" />
              Tratamentos
            </p>
            <h2
              id="tratamentos-title"
              data-reveal="lines"
              className="max-w-3xl font-display text-headline font-extralight tracking-[-0.03em] text-balance lg:text-[clamp(2.25rem,1rem+2.6vw,4rem)]"
            >
              Cuidado e estética em <em className="font-light text-taupe-deep italic">perfeita harmonia.</em>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-sm leading-relaxed text-ink/75">
              Cada procedimento é indicado após avaliação individual. Conheça as possibilidades e converse com a
              clínica sobre o seu caso.
            </p>
            <div className="mt-5 hidden items-center gap-4 lg:flex" aria-hidden>
              <span className="eyebrow text-[0.6rem] text-ink/60">Role para explorar</span>
              <span className="relative h-px w-40 bg-ink/15">
                <span data-treatments-progress className="absolute inset-0 origin-left scale-x-0 bg-ink" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={viewport}
        className="mt-12 lg:mt-8 lg:overflow-x-auto [.motion-ok_&]:lg:overflow-hidden snap-carousel"
      >
        <ul
          ref={track}
          className="container-lux grid gap-6 sm:grid-cols-2 lg:mx-0 lg:flex lg:w-max lg:max-w-none lg:gap-6 lg:pr-[10vw]"
        >
          {publishedTreatments.map((t, i) => (
            <li key={t.slug} data-treatment-card className="lg:w-[30vw] lg:max-w-[440px] lg:min-w-[340px]">
              <article className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-offwhite/70 shadow-[0_1px_0_rgba(37,37,37,0.04)] ring-1 ring-ink/5 transition-[transform,box-shadow,background-color] duration-700 ease-[var(--ease-luxe)] hover:-translate-y-2 hover:bg-offwhite hover:shadow-[0_40px_80px_-40px_rgba(37,37,37,0.45)]">
                <div className="relative m-2 aspect-[5/4] overflow-hidden rounded-[22px] lg:aspect-auto lg:h-[min(27svh,280px)]">
                  <div
                    data-card-image
                    className="absolute -inset-x-[10%] inset-y-0 transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-[1.06]"
                  >
                    <Media
                      asset={t.image}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <span className="absolute top-4 right-4 z-[2] rounded-full bg-offwhite/80 px-3 py-1 text-[0.62rem] font-medium tracking-[0.18em] uppercase backdrop-blur">
                    {t.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 pt-5 md:p-7 md:pt-5 lg:pb-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-title font-light tracking-[-0.02em]">{t.name}</h3>
                    <span className="eyebrow text-taupe-deep">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">{t.short}</p>
                  <ul className="mt-5 flex flex-wrap gap-2 [@media(min-width:1024px)_and_(max-height:860px)]:hidden" aria-label="Benefícios potenciais">
                    {t.benefits.map((b) => (
                      <li key={b} className="rounded-full border border-ink/12 px-3 py-1 text-[0.7rem] text-ink/75">
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-6">
                    <WhatsAppCta
                      location="treatment-card"
                      treatment={{ slug: t.slug, name: t.name }}
                      className="min-h-11 px-5"
                    >
                      Agendar avaliação
                    </WhatsAppCta>
                    <Link
                      href={`/tratamentos/${t.slug}`}
                      onClick={() => trackEvent("treatment_select", { location: "treatment-card", treatment: t.slug })}
                      className="link-underline text-[0.8rem] font-medium"
                    >
                      Saiba mais<span className="sr-only"> sobre {t.name}</span>
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          ))}

          <li data-treatment-card className="sm:col-span-2 lg:w-[26vw] lg:min-w-[300px]">
            <div className="flex h-full min-h-72 flex-col justify-between rounded-[28px] bg-ink p-8 text-offwhite">
              <p className="eyebrow text-blush">Não sabe por onde começar?</p>
              <div>
                <p className="font-display text-2xl leading-snug font-extralight">
                  A avaliação é o primeiro passo para entender o que faz sentido para você.
                </p>
                <WhatsAppCta location="treatments-end" variant="light" className="mt-8">
                  Agendar avaliação
                </WhatsAppCta>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
