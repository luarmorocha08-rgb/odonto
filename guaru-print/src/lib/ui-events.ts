"use client";

/** Abre diálogos globais de qualquer lugar (botões, atalhos, CTAs). */
export type UiEvent = "search" | "assistant";

export function openUi(name: UiEvent, detail?: string) {
  window.dispatchEvent(new CustomEvent(`gp:open-${name}`, { detail }));
}

export function onUi(name: UiEvent, handler: (detail?: string) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<string | undefined>).detail);
  window.addEventListener(`gp:open-${name}`, listener);
  return () => window.removeEventListener(`gp:open-${name}`, listener);
}
