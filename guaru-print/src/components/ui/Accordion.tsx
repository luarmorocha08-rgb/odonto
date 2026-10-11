"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";

type Item = { id: string; question: string; answer: string; pending?: boolean };

/** Acordeão acessível (aria-expanded + regiões associadas). */
export function Accordion({ items, className }: { items: readonly Item[]; className?: string }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  const baseId = useId();

  return (
    <ul className={cn("border-t border-white/10", className)}>
      {items.map((item) => {
        const isOpen = open === item.id;
        const panelId = `${baseId}-${item.id}-panel`;
        const buttonId = `${baseId}-${item.id}-button`;
        return (
          <li key={item.id} className="border-b border-white/10">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className={cn("font-sub text-lg font-semibold transition-colors md:text-xl", isOpen ? "text-paper" : "text-white/75 group-hover:text-paper")}>
                  {item.question}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "relative grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-500",
                    isOpen ? "border-magenta bg-magenta" : "border-white/20 group-hover:border-white/60",
                  )}
                >
                  <span className="absolute h-[2px] w-3.5 bg-current" />
                  <span className={cn("absolute h-3.5 w-[2px] bg-current transition-transform duration-500", isOpen && "scale-y-0")} />
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
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pr-14 pb-7 leading-relaxed text-white/70">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
