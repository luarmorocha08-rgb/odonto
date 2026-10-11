"use client";

import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/config/site";
import type { Service } from "@/content/types";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { onUi } from "@/lib/ui-events";

/**
 * Assistente "Preciso de ajuda para escolher".
 * Recomenda CATEGORIAS a partir de respostas objetivas — não define
 * materiais nem especificações técnicas (isso fica com a equipe).
 */
type Weights = Record<string, number>;
type Question = { id: string; title: string; options: { label: string; weights: Weights }[] };

const QUESTIONS: Question[] = [
  {
    id: "onde",
    title: "Onde você pretende utilizar o material?",
    options: [
      { label: "Ambiente interno", weights: { sinalizacao: 2, "letreiros-e-luminosos": 2, "adesivos-personalizados": 2, "impressos-personalizados": 1 } },
      { label: "Ambiente externo", weights: { banners: 3, "fachadas-comerciais": 2, sinalizacao: 2, cavaletes: 1 } },
      { label: "Vitrine", weights: { "adesivos-personalizados": 4, "letreiros-e-luminosos": 1 } },
      { label: "Fachada", weights: { "fachadas-comerciais": 4, "letreiros-e-luminosos": 3 } },
      { label: "Evento", weights: { banners: 4, panfletos: 2, "impressos-personalizados": 1 } },
      { label: "Na mão do cliente", weights: { panfletos: 4, "impressos-personalizados": 3 } },
    ],
  },
  {
    id: "objetivo",
    title: "Qual é o objetivo principal?",
    options: [
      { label: "Divulgar uma promoção", weights: { banners: 3, panfletos: 3, cavaletes: 3, "adesivos-personalizados": 1 } },
      { label: "Identificar o negócio", weights: { "fachadas-comerciais": 3, "letreiros-e-luminosos": 3, "adesivos-personalizados": 1 } },
      { label: "Orientar pessoas", weights: { sinalizacao: 4 } },
      { label: "Fortalecer a marca", weights: { "impressos-personalizados": 3, "adesivos-personalizados": 2, "letreiros-e-luminosos": 1 } },
      { label: "Decorar o ambiente", weights: { "adesivos-personalizados": 3, "letreiros-e-luminosos": 2 } },
    ],
  },
  {
    id: "tempo",
    title: "Por quanto tempo vai usar?",
    options: [
      { label: "Poucos dias (ação pontual)", weights: { banners: 2, panfletos: 2 } },
      { label: "Alguns meses", weights: { "adesivos-personalizados": 1, cavaletes: 2, banners: 1 } },
      { label: "Permanente", weights: { "fachadas-comerciais": 2, "letreiros-e-luminosos": 2, sinalizacao: 2 } },
      { label: "Ainda não sei", weights: {} },
    ],
  },
];

export function AssistantDialog({ services }: { services: Service[] }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  useEffect(
    () =>
      onUi("assistant", () => {
        setStep(0);
        setAnswers([]);
        setOpen(true);
      }),
    [],
  );

  const done = step >= QUESTIONS.length;

  const recommendations = useMemo(() => {
    if (!done) return [];
    const score: Weights = {};
    answers.forEach((optionIndex, q) => {
      for (const [slug, w] of Object.entries(QUESTIONS[q].options[optionIndex].weights)) score[slug] = (score[slug] ?? 0) + w;
    });
    return services
      .map((s) => ({ service: s, score: score[s.slug] ?? 0 }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [answers, done, services]);

  const choose = (index: number) => {
    const next = [...answers.slice(0, step), index];
    setAnswers(next);
    setStep(step + 1);
    if (step + 1 === QUESTIONS.length) trackEvent("assistant_complete");
  };

  const summary = answers.map((a, q) => QUESTIONS[q].options[a]?.label).filter(Boolean).join(" · ");

  return (
    <Dialog open={open} onClose={() => setOpen(false)} label="Assistente para escolher o produto" className="max-w-xl">
      <div className="p-6 md:p-8">
        <p className="eyebrow">
          <Sparkles className="size-3.5 text-yellow" aria-hidden /> Ajuda para escolher
        </p>
        <div className="mt-4 flex gap-1.5" aria-hidden>
          {QUESTIONS.map((q, i) => (
            <span key={q.id} className={cn("h-1 flex-1 rounded-full transition-colors duration-500", i < step ? "bg-cyan" : i === step ? "bg-white/40" : "bg-white/10")} />
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {!done ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="mt-6 font-display text-2xl leading-tight md:text-3xl" aria-live="polite">
                {QUESTIONS[step].title}
              </h2>
              <p className="mt-1 text-sm text-mute">
                Pergunta {step + 1} de {QUESTIONS.length}
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {QUESTIONS[step].options.map((o, i) => (
                  <button
                    key={o.label}
                    type="button"
                    onClick={() => choose(i)}
                    className={cn(
                      "group flex min-h-14 items-center justify-between gap-3 rounded-2xl border px-4 text-left font-sub font-semibold transition",
                      answers[step] === i ? "border-cyan bg-cyan/10" : "border-line hover:border-white/40 hover:bg-white/[0.04]",
                    )}
                  >
                    {o.label}
                    <ArrowRight className="size-4 -translate-x-1 text-mute opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button type="button" onClick={() => setStep(step - 1)} className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm text-mute hover:text-paper">
                  <ArrowLeft className="size-4" aria-hidden /> Voltar
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <h2 className="mt-6 font-display text-2xl md:text-3xl" aria-live="polite">
                Boas opções para você
              </h2>
              <p className="mt-1 text-sm text-mute">{summary}</p>
              {recommendations.length ? (
                <ul className="mt-6 space-y-2">
                  {recommendations.map(({ service }, i) => (
                    <li key={service.slug}>
                      <Link
                        href={`/servicos/${service.slug}`}
                        onClick={() => setOpen(false)}
                        className="group flex items-center gap-4 rounded-2xl border border-line p-4 transition hover:border-white/40"
                      >
                        <span className="font-display text-2xl text-white/25">0{i + 1}</span>
                        <span className="flex-1">
                          <span className="block font-sub font-semibold">{service.name}</span>
                          <span className="block text-sm text-mute">{service.tagline}</span>
                        </span>
                        <ArrowRight className="size-4 text-mute transition group-hover:translate-x-1 group-hover:text-paper" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 text-white/80">Converse com a equipe — vamos entender seu caso e indicar o melhor caminho.</p>
              )}
              <p className="mt-5 text-xs leading-relaxed text-mute">
                Recomendação inicial. Material, medidas e acabamento são confirmados pela equipe na análise do seu pedido.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <WhatsAppButton
                  location="assistant"
                  label="Falar com especialista"
                  message={`${siteConfig.messages.expert}${summary ? `\nMinhas respostas: ${summary}` : ""}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setStep(0);
                    setAnswers([]);
                  }}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-sm text-mute hover:text-paper"
                >
                  <RotateCcw className="size-4" aria-hidden /> Recomeçar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Dialog>
  );
}
