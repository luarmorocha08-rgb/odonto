"use client";

import { Search, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useDeferredValue, useMemo, useState } from "react";
import type { Service } from "@/content/types";
import { searchSite, SEARCH_SUGGESTIONS } from "@/lib/search";
import { openUi } from "@/lib/ui-events";
import { ServiceCard } from "./ServiceCard";

/** Catálogo com busca inteligente (sinônimos e termos do dia a dia). */
export function ServiceCatalog({ services }: { services: Service[] }) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const filtered = useMemo(() => {
    if (!deferred.trim()) return services;
    const order = searchSite(deferred, services, 20)
      .filter((r) => r.kind === "serviço")
      .map((r) => r.href.split("/").pop());
    return order.map((slug) => services.find((s) => s.slug === slug)!).filter(Boolean);
  }, [deferred, services]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-mute" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Busque pelo que precisa: "placa para loja", "adesivo para carro"…'
            aria-label="Buscar serviços"
            className="field h-14 pl-12"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="absolute top-1/2 right-3 grid size-9 -translate-y-1/2 place-items-center rounded-full text-mute hover:text-paper" aria-label="Limpar busca">
              <X className="size-4" />
            </button>
          )}
        </div>
        <button type="button" onClick={() => openUi("assistant")} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/15 px-6 font-sub text-sm font-semibold hover:border-white/40">
          <Sparkles className="size-4 text-yellow" aria-hidden /> Preciso de ajuda para escolher
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {SEARCH_SUGGESTIONS.slice(0, 4).map((s) => (
          <button key={s} type="button" onClick={() => setQuery(s)} className="min-h-9 rounded-full bg-white/5 px-3 text-xs text-white/70 hover:bg-white/10 hover:text-paper">
            {s}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {filtered.length} serviços encontrados
      </p>
      <motion.ul layout className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((s, i) => (
            <motion.li key={s.slug} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.45, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}>
              <ServiceCard service={s} index={services.indexOf(s)} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {filtered.length === 0 && (
        <div className="mt-10 rounded-3xl border border-white/10 p-10 text-center">
          <p className="text-white/75">Não encontramos “{query}” no catálogo.</p>
          <p className="mt-1 text-sm text-mute">Fale com a equipe — produzimos muitos itens sob medida.</p>
        </div>
      )}
    </div>
  );
}
