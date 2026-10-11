"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor discreto (desktop): ponto + anel que cresce sobre elementos clicáveis.
 * Desligado em telas de toque e com movimento reduzido.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ok = window.matchMedia("(pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)").matches;
    if (!ok || !dot.current || !ring.current) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let raf = 0;
    let hidden = true;

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      dot.current!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.current!.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (hidden) {
        hidden = false;
        rx = x;
        ry = y;
        ring.current!.dataset.visible = "true";
        dot.current!.dataset.visible = "true";
      }
      const target = e.target as Element | null;
      const interactive = target?.closest<HTMLElement>("a, button, [role='button'], label, summary, [data-cursor]");
      const text = interactive?.dataset.cursor ?? "";
      ring.current!.dataset.state = interactive ? (text ? "label" : "hover") : "idle";
      if (label.current) label.current.textContent = text;
      const field = target?.closest("input, textarea, select, canvas");
      ring.current!.dataset.hidden = field ? "true" : "false";
      dot.current!.dataset.hidden = field ? "true" : "false";
    };
    const leave = () => {
      hidden = true;
      ring.current!.dataset.visible = "false";
      dot.current!.dataset.visible = "false";
    };
    const down = () => (ring.current!.dataset.pressed = "true");
    const up = () => (ring.current!.dataset.pressed = "false");

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] hidden [@media(pointer:fine)]:block">
      <div
        ref={ring}
        data-visible="false"
        className="cursor-ring absolute top-0 left-0 -mt-5 -ml-5 grid size-10 place-items-center rounded-full border border-white/50 opacity-0 transition-[width,height,margin,background,border-color,opacity] duration-300 data-[hidden=true]:opacity-0 data-[pressed=true]:scale-90 data-[state=hover]:-mt-8 data-[state=hover]:-ml-8 data-[state=hover]:size-16 data-[state=hover]:border-magenta data-[state=hover]:bg-magenta/10 data-[state=label]:-mt-11 data-[state=label]:-ml-11 data-[state=label]:size-22 data-[state=label]:border-transparent data-[state=label]:bg-yellow data-[visible=true]:opacity-100"
      >
        <span ref={label} className="font-sub text-[0.7rem] font-semibold tracking-wide text-ink uppercase" />
      </div>
      <div
        ref={dot}
        data-visible="false"
        className="absolute top-0 left-0 -mt-[3px] -ml-[3px] size-1.5 rounded-full bg-paper opacity-0 mix-blend-difference data-[hidden=true]:opacity-0 data-[visible=true]:opacity-100"
      />
    </div>
  );
}
