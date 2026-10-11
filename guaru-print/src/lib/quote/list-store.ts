"use client";

import { useSyncExternalStore } from "react";
import type { QuoteItem } from "./products";

/**
 * Lista de orçamento ("carrinho" sem preços), salva neste navegador.
 * Permite juntar vários produtos em uma única solicitação.
 */
export type ListEntry = QuoteItem & { id: string; addedAt: number };

const KEY = "gp-quote-list-v1";
const EVENT = "gp:quote-list";
const EMPTY: ListEntry[] = [];

let cache: ListEntry[] | null = null;

function read(): ListEntry[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as ListEntry[]) : [];
    cache = Array.isArray(parsed) ? parsed.slice(0, 20) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: ListEntry[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* modo privado: mantém só em memória */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      callback();
    }
  };
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

const newId = () => Math.random().toString(36).slice(2, 10);

export const quoteList = {
  get: () => (typeof window === "undefined" ? EMPTY : read()),
  add(item: QuoteItem) {
    const entry: ListEntry = { ...item, id: newId(), addedAt: Date.now() };
    write([...read(), entry].slice(-20));
    return entry;
  },
  update(id: string, item: QuoteItem) {
    write(read().map((e) => (e.id === id ? { ...e, ...item } : e)));
  },
  remove(id: string) {
    write(read().filter((e) => e.id !== id));
  },
  clear() {
    write([]);
  },
};

export function useQuoteList() {
  return useSyncExternalStore(subscribe, quoteList.get, () => EMPTY);
}
