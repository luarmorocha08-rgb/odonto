"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Animação 4 — Explosão CMYK (transição entre seções).
 * Três gotas de tinta explodem em partículas que se reorganizam numa retícula
 * de meio-tom (halftone) — o mesmo princípio da impressão offset.
 * Canvas 2D leve: só desenha enquanto está na tela e quando o scroll muda.
 */
const COLORS = ["#00AEEF", "#E52B91", "#F7E500"];

type P = { sx: number; sy: number; ex: number; ey: number; tx: number; ty: number; r: number; tr: number; c: number; d: number };

function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function CmykBurst({ title = "Cor, precisão e acabamento.", kicker = "Cada ponto importa" }: { title?: string; kicker?: string }) {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = section.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let particles: P[] = [];
    let progress = reduced ? 1 : 0;
    let raf = 0;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = w < 640 ? 18 : 24;
      const cols = Math.ceil(w / gap) + 1;
      const rows = Math.ceil(h / gap) + 1;
      particles = [];
      const cx = w / 2;
      const cy = h / 2;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const c = (x + y * 2) % 3;
          // Retícula com ângulo por cor (como nas chapas CMYK) e gradiente de tamanho.
          const angle = [0.26, 1.31, 0][c];
          const ox = Math.cos(angle) * 3;
          const oy = Math.sin(angle) * 3;
          const tx = x * gap + ox;
          const ty = y * gap + oy;
          const dist = Math.hypot(tx - cx, ty - cy) / Math.hypot(cx, cy);
          const tr = Math.max(0.6, (gap / 2.4) * (1 - dist) * (0.7 + 0.3 * Math.sin(x * 0.5 + y * 0.3)));
          // Origem: uma de três gotas no centro.
          const drop = [
            [cx - 46, cy + 20],
            [cx + 46, cy + 20],
            [cx, cy - 40],
          ][c];
          const a = Math.random() * Math.PI * 2;
          const burst = (0.35 + Math.random() * 0.75) * Math.max(w, h) * 0.6;
          particles.push({
            sx: drop[0] + Math.cos(a) * Math.random() * 30,
            sy: drop[1] + Math.sin(a) * Math.random() * 30,
            ex: cx + Math.cos(a) * burst,
            ey: cy + Math.sin(a) * burst,
            tx,
            ty,
            r: 2 + Math.random() * 3,
            tr,
            c,
            d: Math.random() * 0.25,
          });
        }
      }
    };

    const draw = () => {
      raf = 0;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "screen";
      const p = progress;
      for (let ci = 0; ci < 3; ci++) {
        ctx.fillStyle = COLORS[ci];
        ctx.beginPath();
        for (const pt of particles) {
          if (pt.c !== ci) continue;
          let x: number;
          let y: number;
          let r: number;
          // 0 → 0,45: explosão | 0,45 → 1: reorganização na retícula
          if (p < 0.45) {
            const t = ease(Math.min(1, Math.max(0, (p / 0.45 - pt.d) / (1 - pt.d))));
            x = pt.sx + (pt.ex - pt.sx) * t;
            y = pt.sy + (pt.ey - pt.sy) * t;
            r = pt.r * (1 - t * 0.4);
          } else {
            const t = ease(Math.min(1, Math.max(0, ((p - 0.45) / 0.55 - pt.d) / (1 - pt.d))));
            x = pt.ex + (pt.tx - pt.ex) * t;
            y = pt.ey + (pt.ty - pt.ey) * t;
            r = pt.r * 0.6 + (pt.tr - pt.r * 0.6) * t;
          }
          if (x < -10 || y < -10 || x > w + 10 || y > h + 10) continue;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const request = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    build();
    request();

    const st = reduced
      ? null
      : ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          end: "bottom 35%",
          scrub: true,
          onUpdate: (self) => {
            progress = self.progress;
            request();
          },
        });

    const ro = new ResizeObserver(() => {
      build();
      request();
    });
    ro.observe(cv);

    return () => {
      st?.kill();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={section} className="relative h-[110svh] overflow-hidden" aria-labelledby="cmyk-title">
      <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,5,0.85)_0%,rgba(5,5,5,0.55)_35%,transparent_70%)]" />
      <div className="relative grid h-full place-items-center px-[var(--gutter)] text-center">
        <div>
          <p className="eyebrow justify-center">{kicker}</p>
          <h2 id="cmyk-title" data-split="words" className="display-lg mx-auto mt-5 max-w-4xl">
            {title}
          </h2>
          <p data-reveal className="mx-auto mt-5 max-w-lg text-white/65">
            Ciano, magenta, amarelo e preto: milhares de pontos de tinta que, juntos, formam a imagem que representa a sua marca.
          </p>
        </div>
      </div>
    </section>
  );
}
