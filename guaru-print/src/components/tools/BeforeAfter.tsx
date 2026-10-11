"use client";

import { ChevronsLeftRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Fachada ilustrada (antes/depois) usada enquanto não há fotos reais. */
export function FacadeDrawing({ stage }: { stage: "before" | "after" }) {
  const after = stage === "after";
  return (
    <svg viewBox="0 0 800 500" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id={`ba-sky-${stage}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={after ? "#0a0b14" : "#8796a6"} />
          <stop offset="1" stopColor={after ? "#251a3a" : "#c9d0d6"} />
        </linearGradient>
        <filter id={`ba-glow-${stage}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <rect width="800" height="500" fill={`url(#ba-sky-${stage})`} />
      <rect x="60" y="70" width="680" height="400" fill={after ? "#2a2a31" : "#9a958e"} />
      {after ? (
        <>
          <rect x="80" y="92" width="640" height="116" rx="6" fill="#0d0d11" />
          <rect x="80" y="92" width="640" height="5" fill="#00AEEF" />
          <rect x="80" y="203" width="640" height="5" fill="#E52B91" />
          <text x="400" y="172" textAnchor="middle" fontFamily="var(--font-montserrat), Arial Black, sans-serif" fontWeight="800" fontStyle="italic" fontSize="68" fill="#00AEEF" filter={`url(#ba-glow-${stage})`}>
            SUA MARCA
          </text>
          <text x="400" y="172" textAnchor="middle" fontFamily="var(--font-montserrat), Arial Black, sans-serif" fontWeight="800" fontStyle="italic" fontSize="68" fill="#fff">
            SUA MARCA
          </text>
        </>
      ) : (
        <>
          <rect x="250" y="112" width="300" height="56" fill="#b8b2aa" stroke="#7c7770" />
          <text x="400" y="149" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="24" fill="#77726b">
            loja
          </text>
          <path d="M120 230 L180 250 M560 100 L620 130" stroke="#7a756f" strokeWidth="2" />
        </>
      )}
      {[100, 420].map((x) => (
        <rect key={x} x={x} y="250" width="280" height="200" fill={after ? "#1d2a37" : "#55626e"} stroke={after ? "#111" : "#6b6862"} strokeWidth="8" />
      ))}
      {after && (
        <>
          <rect x="125" y="350" width="230" height="58" rx="6" fill="#E52B91" />
          <text x="240" y="388" textAnchor="middle" fontFamily="var(--font-montserrat), sans-serif" fontWeight="800" fontSize="24" fill="#050505">
            ABERTO
          </text>
          <circle cx="560" cy="350" r="56" fill="#F7E500" />
          <text x="560" y="358" textAnchor="middle" fontFamily="var(--font-montserrat), sans-serif" fontWeight="800" fontSize="22" fill="#050505">
            NOVIDADE
          </text>
          <path d="M190 214 L110 470 L290 470 Z M610 214 L510 470 L690 470 Z" fill="#fff6c8" opacity="0.12" />
        </>
      )}
      <rect y="470" width="800" height="30" fill={after ? "#141419" : "#6f6b66"} />
    </svg>
  );
}

/**
 * Comparador antes/depois.
 * Funciona com mouse, toque e teclado (setas, Home/End, PageUp/PageDown).
 */
export function BeforeAfter({
  before,
  after,
  beforeLabel = "Antes",
  afterLabel = "Depois",
  label,
  className,
  revealOnView = true,
}: {
  before: string | ReactNode;
  after: string | ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  label: string;
  className?: string;
  revealOnView?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(50);
  const [dragging, setDragging] = useState(false);

  const fromPointer = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setValue(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  // Revelação animada ao entrar na tela.
  useEffect(() => {
    const el = box.current;
    if (!el || !revealOnView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - start) / 1600);
          const out = (x: number) => 1 - Math.pow(1 - x, 3);
          // 8% → 85% → 50%
          setValue(k < 0.55 ? 8 + 77 * out(k / 0.55) : 85 - 35 * out((k - 0.55) / 0.45));
          if (k < 1) raf = requestAnimationFrame(tick);
          else setValue(50);
        };
        setValue(8);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [revealOnView]);

  const render = (src: string | ReactNode, alt: string) =>
    typeof src === "string" ? <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" draggable={false} /> : src;

  return (
    <div
      ref={box}
      className={cn("relative aspect-[16/10] touch-pan-y overflow-hidden rounded-[1.75rem] border border-white/10 select-none", className)}
      onPointerDown={(e) => {
        setDragging(true);
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        fromPointer(e.clientX);
      }}
      onPointerMove={(e) => dragging && fromPointer(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      data-cursor="Arraste"
    >
      <div className="absolute inset-0">{render(after, `${label} — ${afterLabel}`)}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        {render(before, `${label} — ${beforeLabel}`)}
      </div>
      <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold tracking-wider uppercase backdrop-blur">{beforeLabel}</span>
      <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-paper px-3 py-1 text-xs font-semibold tracking-wider text-ink uppercase">{afterLabel}</span>

      <div className="pointer-events-none absolute inset-y-0 w-[2px] -translate-x-1/2 bg-paper shadow-[0_0_20px_rgba(255,255,255,0.6)]" style={{ left: `${value}%` }} />
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Comparar antes e depois: ${label}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        aria-valuetext={`${Math.round(value)}% mostrando o antes`}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 10 : 2;
          const map: Record<string, number> = {
            ArrowLeft: value - step,
            ArrowDown: value - step,
            ArrowRight: value + step,
            ArrowUp: value + step,
            PageDown: value - 10,
            PageUp: value + 10,
            Home: 0,
            End: 100,
          };
          if (e.key in map) {
            e.preventDefault();
            setValue(Math.min(100, Math.max(0, map[e.key])));
          }
        }}
        className="absolute top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-paper text-ink shadow-xl transition-transform focus-visible:scale-110"
        style={{ left: `${value}%` }}
      >
        <ChevronsLeftRight className="size-6" aria-hidden />
      </div>
    </div>
  );
}
