"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { testimonials } from "@/content/testimonials";
import { publishedTreatments } from "@/content/treatments";

/** Depoimentos reais e autorizados. Sem itens cadastrados, a seção não é renderizada. */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  if (testimonials.length === 0) return null;

  const current = testimonials[index];
  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  const treatment = publishedTreatments.find((t) => t.slug === current.treatment);

  return (
    <section aria-labelledby="depoimentos-title" data-tone="blush" className="relative py-28 md:py-40">
      <div className="container-lux">
        <p className="eyebrow mb-5 flex items-center gap-3 text-taupe-deep">
          <span className="h-px w-10 bg-current" />
          Depoimentos
        </p>
        <h2
          id="depoimentos-title"
          data-reveal="lines"
          className="max-w-4xl font-display text-headline font-extralight tracking-[-0.03em] text-balance"
        >
          Confiança construída em <em className="font-light text-taupe-deep italic">cada atendimento.</em>
        </h2>

        <div
          className="mt-16 rounded-[32px] bg-offwhite/70 p-8 md:p-14"
          role="region"
          aria-roledescription="carrossel"
          aria-label="Depoimentos de pacientes"
        >
          <div aria-live="polite" className="min-h-48">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={current.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-display text-title leading-snug font-extralight">“{current.text}”</p>
                <footer className="mt-8 text-sm">
                  <span className="font-medium">{current.author}</span>
                  {treatment && <span className="text-ink/60"> · {treatment.name}</span>}
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {testimonials.length > 1 && (
            <div className="mt-10 flex items-center justify-between">
              <p className="eyebrow text-ink/60">
                {String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
              </p>
              <div className="flex gap-2">
                <button type="button" onClick={() => go(-1)} aria-label="Depoimento anterior" className="grid size-12 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-offwhite">
                  <ArrowLeft strokeWidth={1.4} className="size-5" />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Próximo depoimento" className="grid size-12 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-offwhite">
                  <ArrowRight strokeWidth={1.4} className="size-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
