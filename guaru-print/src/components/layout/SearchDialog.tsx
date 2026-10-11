"use client";

import { ArrowRight, CornerDownLeft, Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useId, useMemo, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import type { Service } from "@/content/types";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { SEARCH_SUGGESTIONS, searchSite } from "@/lib/search";
import { onUi, openUi } from "@/lib/ui-events";

/** Busca inteligente de serviços (Ctrl/⌘ + K). */
export function SearchDialog({ services }: { services: Service[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const deferred = useDeferredValue(query);
  const router = useRouter();
  const listId = useId();
  const results = useMemo(() => searchSite(deferred, services, 7), [deferred, services]);

  useEffect(() => onUi("search", (q) => {
    setQuery(q ?? "");
    setActive(0);
    setOpen(true);
  }), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    trackEvent("search_use", { action: deferred.slice(0, 40) });
    setOpen(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} label="Buscar serviços" position="top" className="max-w-2xl">
      <div className="p-3 md:p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-ink px-4">
          <Search className="size-5 shrink-0 text-mute" aria-hidden />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && results[active]) {
                e.preventDefault();
                go(results[active].href);
              }
            }}
            placeholder='O que você precisa? Ex.: "placa para loja"'
            className="h-14 w-full bg-transparent pr-10 text-paper placeholder:text-[#6b6b75] focus:outline-none"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
            aria-label="Buscar serviços"
          />
        </div>

        {query.trim() === "" ? (
          <div className="px-2 pt-5 pb-3">
            <p className="eyebrow mb-3">Sugestões</p>
            <div className="flex flex-wrap gap-2">
              {SEARCH_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="min-h-10 rounded-full border border-line px-4 text-sm text-white/80 transition hover:border-cyan hover:text-paper"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <p className="text-white/70">Nada encontrado para “{query}”.</p>
            <button
              type="button"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-5 text-sm font-semibold hover:bg-white/15"
              onClick={() => {
                setOpen(false);
                openUi("assistant");
              }}
            >
              <Sparkles className="size-4 text-yellow" aria-hidden /> Preciso de ajuda para escolher
            </button>
          </div>
        ) : (
          <ul id={listId} role="listbox" aria-label="Resultados" className="mt-2 max-h-[60vh] overflow-y-auto py-1">
            {results.map((r, i) => (
              <li key={r.href} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r.href)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition",
                    i === active ? "bg-white/[0.07]" : "hover:bg-white/[0.04]",
                  )}
                >
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide uppercase",
                      r.kind === "serviço" ? "bg-cyan/15 text-cyan" : "bg-magenta/15 text-magenta",
                    )}
                  >
                    {r.kind}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-sub font-semibold">{r.title}</span>
                    <span className="block truncate text-sm text-mute">{r.description}</span>
                  </span>
                  {i === active ? <CornerDownLeft className="size-4 text-mute" aria-hidden /> : <ArrowRight className="size-4 text-mute" aria-hidden />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Dialog>
  );
}
