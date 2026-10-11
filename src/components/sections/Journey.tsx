"use client";

import { useRef } from "react";
import { journey } from "@/content/journey";
import { WhatsAppCta } from "@/components/ui/CtaLink";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

export function Journey() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Linha preenchida progressivamente durante o scroll
        gsap.fromTo(
          "[data-journey-line]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-journey-list]", start: "top 70%", end: "bottom 60%", scrub: true },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-journey-step]").forEach((step) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: "top 75%", once: true } });
          tl.from(step.querySelector("[data-step-number]"), { yPercent: 100, duration: 1.3, ease: "expo.out" })
            .from(step.querySelector("[data-step-dot]"), { scale: 0, duration: 0.8, ease: "back.out(2)" }, 0)
            .from(step.querySelectorAll("[data-step-text]"), { autoAlpha: 0, y: 20, stagger: 0.1, duration: 1 }, 0.2);
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="jornada-title" data-tone="white" className="relative py-28 md:py-40">
      <div className="container-lux grid gap-14 lg:grid-cols-12">
        <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
          <p className="eyebrow mb-5 flex items-center gap-3 text-taupe-deep">
            <span className="h-px w-10 bg-current" />
            Jornada do paciente
          </p>
          <h2
            id="jornada-title"
            data-reveal="lines"
            className="font-display text-headline font-extralight tracking-[-0.03em] text-balance"
          >
            Seu cuidado <em className="font-light text-taupe-deep italic">começa aqui.</em>
          </h2>
          <p data-reveal="fade" className="mt-6 max-w-sm text-sm leading-relaxed text-ink/70">
            Um processo simples e transparente, do primeiro contato ao planejamento do seu cuidado.
          </p>
          <div data-reveal="fade" className="mt-9">
            <WhatsAppCta location="journey">Dar o primeiro passo</WhatsAppCta>
          </div>
        </div>

        <ol data-journey-list className="relative lg:col-span-6 lg:col-start-7">
          <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-ink/10">
            <span data-journey-line className="absolute inset-0 origin-top bg-taupe" />
          </span>
          {journey.map((step) => (
            <li key={step.number} data-journey-step className="relative pb-16 pl-12 last:pb-0 md:pl-16">
              <span
                aria-hidden
                data-step-dot
                className="absolute top-3 left-0 size-[15px] rounded-full border border-taupe bg-white"
              />
              <span className="block overflow-hidden">
                <span
                  data-step-number
                  aria-hidden
                  className="block font-display text-[clamp(4rem,3rem+5vw,8rem)] leading-[0.9] font-extralight text-taupe"
                >
                  {step.number}
                </span>
              </span>
              <h3 data-step-text className="mt-4 font-sans text-xl font-medium tracking-[-0.01em]">
                <span className="sr-only">Etapa {step.number}: </span>
                {step.title}
              </h3>
              <p data-step-text className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink/70">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
