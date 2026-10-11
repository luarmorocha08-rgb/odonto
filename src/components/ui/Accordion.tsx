"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";

type Item = { question: string; answer: string };

/** Acordeão acessível (botões com aria-expanded e regiões associadas). */
export function Accordion({ items, className }: { items: readonly Item[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <ul className={cn("border-t border-ink/15", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <li key={item.question} className="border-b border-ink/15">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
              >
                <span className="font-sans text-[1.02rem] font-medium tracking-[-0.005em] transition-colors md:text-lg">
                  {item.question}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "relative grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-500",
                    isOpen ? "border-ink bg-ink text-offwhite" : "border-ink/20 group-hover:border-ink",
                  )}
                >
                  <span className="absolute h-px w-3.5 bg-current" />
                  <span
                    className={cn(
                      "absolute h-3.5 w-px bg-current transition-transform duration-500 ease-[var(--ease-luxe)]",
                      isOpen && "scale-y-0",
                    )}
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pr-14 pb-7 text-[0.95rem] leading-relaxed text-ink/70">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
