"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/**
 * Animação 3 — Fachada antes e depois.
 * Uma fachada simples recebe, conforme o scroll: placa em ACM, adesivos nos
 * vidros, letras-caixa, iluminação e o resultado final à noite.
 */
const STEPS = ["Fachada original", "Instalação da placa", "Adesivos nos vidros", "Letras-caixa", "Luminosos acesos", "Resultado final"];
const LETTERS = "SUA MARCA".split("");

export function FacadeTransform() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        gsap.set(q("[data-f='panel']"), { yPercent: -140, autoAlpha: 0 });
        gsap.set(q("[data-f='vinyl']"), { clipPath: "inset(0 100% 0 0)" });
        gsap.set(q("[data-f='letter']"), { autoAlpha: 0, scale: 0.4, y: -20, transformOrigin: "50% 100%", transformBox: "fill-box" });
        gsap.set(q("[data-f='night'], [data-f='glow'], [data-f='beam']"), { autoAlpha: 0 });
        gsap.set(q("[data-f='old']"), { autoAlpha: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=300%", scrub: 0.8, pin: q("[data-pin]")[0] },
        });
        const step = (i: number, at: number) => {
          tl.to(q("[data-step]"), { color: "rgba(255,255,255,0.35)", duration: 0.1 }, at)
            .to(q(`[data-step='${i}']`), { color: "#ffffff", duration: 0.1 }, at)
            .to(q("[data-progress]"), { scaleY: (i + 1) / STEPS.length, duration: 0.3 }, at);
        };
        step(0, 0);
        step(1, 0.4);
        tl.to(q("[data-f='old']"), { autoAlpha: 0, duration: 0.3 }, 0.4).to(q("[data-f='panel']"), { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "back.out(1.2)" }, 0.5);
        step(2, 1.4);
        tl.to(q("[data-f='vinyl']"), { clipPath: "inset(0 0% 0 0)", duration: 0.9, stagger: 0.2, ease: "power1.inOut" }, 1.4);
        step(3, 2.6);
        tl.to(q("[data-f='letter']"), { autoAlpha: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "back.out(2)" }, 2.6);
        step(4, 3.8);
        tl.to(q("[data-f='night']"), { autoAlpha: 1, duration: 0.8 }, 3.8)
          .to(q("[data-f='glow']"), { autoAlpha: 1, duration: 0.5, stagger: 0.05 }, 4.1)
          .to(q("[data-f='beam']"), { autoAlpha: 1, duration: 0.6 }, 4.2)
          .to(q("[data-f='letter-fill']"), { fill: "#ffffff", duration: 0.4 }, 4.1);
        step(5, 4.9);
        tl.fromTo(q("[data-f='scene']"), { scale: 1 }, { scale: 1.04, duration: 0.6 }, 4.9).to({}, { duration: 0.4 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative" aria-labelledby="fachada-title">
      <div data-pin className="relative flex min-h-[100svh] items-center overflow-hidden py-20">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[0.8fr_1.4fr]">
          <div>
            <p className="eyebrow">Antes e depois</p>
            <h2 id="fachada-title" className="display-lg mt-5">
              Uma fachada que <span className="text-cmyk">vende por você.</span>
            </h2>
            <p className="mt-5 max-w-md text-white/65">
              Placas, adesivos, letras-caixa e iluminação trabalhando juntos para transformar a aparência do seu negócio.
            </p>
            <div className="relative mt-8 hidden pl-6 sm:block">
              <span aria-hidden className="absolute top-0 bottom-0 left-0 w-px bg-white/10" />
              <span data-progress aria-hidden className="absolute top-0 bottom-0 left-0 w-px origin-top scale-y-100 bg-gradient-to-b from-cyan via-magenta to-yellow motion-safe:scale-y-[0.16]" />
              <ol className="space-y-2.5">
                {STEPS.map((s, i) => (
                  <li key={s} data-step={i} className="font-sub font-semibold text-white motion-safe:text-white/35">
                    <span className="mr-3 font-mono text-xs opacity-60">0{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]">
            <svg data-f="scene" viewBox="0 0 800 560" className="block h-auto w-full" role="img" aria-label="Ilustração de uma fachada comercial recebendo placa, adesivos, letras-caixa e iluminação">
              <defs>
                <linearGradient id="sky-day" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#7d8fa3" />
                  <stop offset="1" stopColor="#c8d0d8" />
                </linearGradient>
                <linearGradient id="sky-night" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#05060c" />
                  <stop offset="1" stopColor="#1b1530" />
                </linearGradient>
                <linearGradient id="acm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#2b2b33" />
                  <stop offset="0.5" stopColor="#16161b" />
                  <stop offset="1" stopColor="#0b0b0e" />
                </linearGradient>
                <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#4a5d70" />
                  <stop offset="1" stopColor="#1e2934" />
                </linearGradient>
                <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
                <radialGradient id="beam" cx="0.5" cy="0" r="1">
                  <stop offset="0" stopColor="#fff6c8" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#fff6c8" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="800" height="560" fill="url(#sky-day)" />
              <rect data-f="night" width="800" height="560" fill="url(#sky-night)" className="motion-reduce:opacity-100" style={{ opacity: 1 }} />

              {/* Prédio */}
              <rect x="70" y="90" width="660" height="430" fill="#8e8a84" />
              <rect x="70" y="90" width="660" height="430" fill="#000" opacity="0.15" />
              <rect x="70" y="80" width="660" height="18" fill="#6f6b66" />
              {/* Placa antiga */}
              <g data-f="old" style={{ opacity: 0 }}>
                <rect x="250" y="130" width="300" height="60" fill="#b9b4ac" stroke="#7c7770" />
                <text x="400" y="170" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="26" fill="#6f6b66">
                  loja
                </text>
              </g>

              {/* Placa ACM */}
              <g data-f="panel">
                <rect x="90" y="110" width="620" height="120" rx="6" fill="url(#acm)" />
                <rect x="90" y="110" width="620" height="6" rx="3" fill="#00AEEF" />
                <rect x="90" y="224" width="620" height="6" rx="3" fill="#E52B91" />
                <rect x="90" y="110" width="620" height="120" rx="6" fill="url(#glass)" opacity="0.06" />
              </g>

              {/* Brilho das letras (aparece com a luz) */}
              <g data-f="glow" filter="url(#neon)" style={{ opacity: 1 }}>
                <text x="400" y="196" textAnchor="middle" fontFamily="var(--font-montserrat), Arial Black, sans-serif" fontWeight="800" fontStyle="italic" fontSize="72" fill="#00AEEF" letterSpacing="-2">
                  SUA MARCA
                </text>
              </g>
              {/* Letras-caixa */}
              <g fontFamily="var(--font-montserrat), Arial Black, sans-serif" fontWeight="800" fontStyle="italic" fontSize="72" letterSpacing="-2">
                {LETTERS.map((ch, i) =>
                  ch === " " ? null : (
                    <text key={i} data-f="letter" x={186 + i * 50} y="196" textAnchor="middle">
                      <tspan data-f="letter-fill" fill="#ffffff" className="motion-safe:[fill:#d9d9de]">
                        {ch}
                      </tspan>
                    </text>
                  ),
                )}
              </g>

              {/* Vitrines */}
              {[110, 430].map((x) => (
                <g key={x}>
                  <rect x={x} y="270" width="260" height="230" fill="url(#glass)" stroke="#2a2f36" strokeWidth="8" />
                  <path d={`M${x + 20} 290 l60 0 l-80 120 z`} fill="#fff" opacity="0.08" />
                </g>
              ))}
              {/* Adesivos nos vidros */}
              <g data-f="vinyl">
                <rect x="130" y="380" width="220" height="64" rx="6" fill="#E52B91" />
                <text x="240" y="420" textAnchor="middle" fontFamily="var(--font-montserrat), sans-serif" fontWeight="800" fontSize="26" fill="#050505">
                  ABERTO
                </text>
              </g>
              <g data-f="vinyl">
                <circle cx="560" cy="385" r="64" fill="#F7E500" />
                <text x="560" y="378" textAnchor="middle" fontFamily="var(--font-montserrat), sans-serif" fontWeight="800" fontSize="22" fill="#050505">
                  NOVA
                </text>
                <text x="560" y="404" textAnchor="middle" fontFamily="var(--font-montserrat), sans-serif" fontWeight="800" fontSize="22" fill="#050505">
                  LOJA
                </text>
              </g>
              <g data-f="vinyl">
                <rect x="110" y="482" width="580" height="12" fill="#00AEEF" opacity="0.9" />
              </g>

              {/* Feixes das luminárias */}
              <g data-f="beam" style={{ opacity: 1 }}>
                <path d="M200 236 L120 520 L300 520 Z" fill="url(#beam)" />
                <path d="M600 236 L500 520 L680 520 Z" fill="url(#beam)" />
              </g>
              {[200, 600].map((x) => (
                <rect key={x} x={x - 18} y="230" width="36" height="8" rx="4" fill="#3a3a44" />
              ))}
              <rect x="0" y="520" width="800" height="40" fill="#1a1a20" />
              <rect x="0" y="520" width="800" height="3" fill="#2c2c34" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
