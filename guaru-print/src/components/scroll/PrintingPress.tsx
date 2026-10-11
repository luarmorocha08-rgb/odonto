"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/**
 * Animação 1 — Impressão em tempo real.
 * O scroll controla a folha saindo da impressora e as passadas de tinta:
 * ciano → magenta → amarelo → preto. As camadas usam `mix-blend-mode:
 * multiply`, então as sobreposições geram as cores reais da mistura CMYK.
 */
const PHASES = [
  { key: "papel", label: "Papel", text: "A folha entra em branco na impressora.", color: "#ffffff" },
  { key: "c", label: "Ciano", text: "Primeira passada: ciano.", color: "#00AEEF" },
  { key: "m", label: "Magenta", text: "Magenta sobre ciano cria os azuis e violetas.", color: "#E52B91" },
  { key: "y", label: "Amarelo", text: "O amarelo completa vermelhos e verdes.", color: "#F7E500" },
  { key: "k", label: "Preto", text: "O preto (K) dá contraste, textos e definição.", color: "#9a9aa2" },
  { key: "ok", label: "Panfleto pronto", text: "Arte impressa, conferida e pronta para divulgar.", color: "#ffffff" },
];

function ArtLayer({ channel }: { channel: "c" | "m" | "y" | "k" }) {
  const fill = { c: "#00AEEF", m: "#E52B91", y: "#F7E500", k: "#111111" }[channel];
  return (
    <svg data-layer={channel} viewBox="0 0 210 297" className="absolute inset-0 h-full w-full mix-blend-multiply" aria-hidden>
      {channel === "c" && (
        <>
          <circle cx="160" cy="70" r="58" fill={fill} />
          <rect x="0" y="230" width="210" height="67" fill={fill} opacity="0.85" />
          <rect x="20" y="196" width="60" height="16" rx="8" fill={fill} />
        </>
      )}
      {channel === "m" && (
        <>
          <rect x="0" y="0" width="210" height="128" fill={fill} />
          <circle cx="40" cy="250" r="36" fill={fill} />
        </>
      )}
      {channel === "y" && (
        <>
          <rect x="0" y="96" width="210" height="44" fill={fill} />
          <circle cx="160" cy="70" r="30" fill={fill} />
          <rect x="120" y="244" width="90" height="53" fill={fill} />
        </>
      )}
      {channel === "k" && (
        <g fill={fill}>
          <text x="18" y="60" fontFamily="var(--font-montserrat), sans-serif" fontWeight="800" fontStyle="italic" fontSize="34" letterSpacing="-1.5">
            SUA
          </text>
          <text x="18" y="92" fontFamily="var(--font-montserrat), sans-serif" fontWeight="800" fontStyle="italic" fontSize="34" letterSpacing="-1.5">
            IDEIA
          </text>
          <text x="18" y="126" fontFamily="var(--font-montserrat), sans-serif" fontWeight="800" fontStyle="italic" fontSize="22" letterSpacing="-1">
            IMPRESSA
          </text>
          <rect x="20" y="158" width="130" height="7" rx="3.5" />
          <rect x="20" y="172" width="100" height="5" rx="2.5" opacity="0.5" />
          <rect x="20" y="183" width="115" height="5" rx="2.5" opacity="0.5" />
          <rect x="100" y="196" width="70" height="16" rx="8" />
          <text x="150" y="282" fontFamily="var(--font-montserrat), sans-serif" fontWeight="800" fontSize="10" textAnchor="middle" fill="#111">
            GUARU PRINT
          </text>
        </g>
      )}
    </svg>
  );
}

export function PrintingPress() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        gsap.set(q("[data-layer]"), { clipPath: "inset(0 0 100% 0)" });
        gsap.set(q("[data-phase]"), { autoAlpha: 0, y: 20 });
        gsap.set(q("[data-phase='papel']"), { autoAlpha: 1, y: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=320%", scrub: 0.8, pin: q("[data-pin]")[0] },
        });

        const phase = (key: string, at: number | string) => {
          tl.to(q("[data-phase]"), { autoAlpha: 0, y: -16, duration: 0.15 }, at).to(q(`[data-phase='${key}']`), { autoAlpha: 1, y: 0, duration: 0.2 }, ">");
          tl.to(q("[data-dot]"), { backgroundColor: "rgba(255,255,255,0.15)", scale: 1, duration: 0.1 }, "<").to(q(`[data-dot='${key}']`), { backgroundColor: "#fff", scale: 1.6, duration: 0.1 }, "<");
        };

        // Folha sai da impressora.
        tl.fromTo(q("[data-sheet]"), { yPercent: -88 }, { yPercent: 0, duration: 1, ease: "power1.inOut" });
        // Cabeça de impressão varre a folha a cada cor.
        (["c", "m", "y", "k"] as const).forEach((ch, i) => {
          const at = 0.4 + i * 1.05;
          phase(ch, at);
          tl.fromTo(q("[data-head]"), { top: "0%" }, { top: "100%", duration: 0.9, ease: "power1.inOut" }, at)
            .to(q(`[data-layer='${ch}']`), { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "power1.inOut" }, at)
            .to(q("[data-head]"), { "--ink": ["#00AEEF", "#E52B91", "#F7E500", "#111"][i], duration: 0.01 }, at);
        });
        // Vira panfleto: sai da máquina, gira e ganha destaque.
        phase("ok", 4.7);
        tl.to(q("[data-head]"), { autoAlpha: 0, duration: 0.2 }, 4.6)
          .to(q("[data-printer]"), { yPercent: 30, autoAlpha: 0.15, scale: 0.9, duration: 0.8, ease: "power2.in" }, 4.7)
          .to(q("[data-sheet-wrap]"), { y: "-6vh", rotateX: 0, rotateZ: -4, scale: 1.12, duration: 1, ease: "power2.out" }, 4.8)
          .to(q("[data-sheet]"), { boxShadow: "0 60px 90px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.1)", duration: 0.6 }, 5)
          .to(q("[data-shine]"), { xPercent: 220, duration: 0.8, ease: "power2.inOut" }, 5.2)
          .to({}, { duration: 0.4 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="impressao" className="relative" aria-labelledby="impressao-title">
      <div data-pin className="relative flex min-h-[100svh] items-center overflow-hidden py-24">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="relative z-10">
            <p className="eyebrow">Impressão em tempo real</p>
            <h2 id="impressao-title" className="display-lg mt-5">
              Da tela para o papel, <span className="text-cmyk">cor por cor.</span>
            </h2>
            <p className="mt-5 max-w-md text-white/65">
              Toda impressão colorida nasce de quatro tintas: ciano, magenta, amarelo e preto. Role a página e acompanhe o processo.
            </p>
            <div className="relative mt-8 h-20" aria-live="polite">
              {PHASES.map((p) => (
                <div key={p.key} data-phase={p.key} className="absolute inset-0 motion-reduce:hidden [&:last-child]:motion-reduce:block">
                  <p className="font-sub text-xl font-semibold" style={{ color: p.color }}>
                    {p.label}
                  </p>
                  <p className="mt-1 text-white/60">{p.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3" aria-hidden>
              {PHASES.map((p) => (
                <span key={p.key} data-dot={p.key} className="size-2 rounded-full bg-white/15" />
              ))}
            </div>
          </div>

          <div className="relative mx-auto aspect-[4/5] w-full max-w-[30rem] [perspective:1400px]">
            {/* Impressora estilizada */}
            <div data-printer className="absolute inset-x-0 top-0 z-20 [transform-style:preserve-3d]">
              <div className="relative mx-auto h-28 w-[92%] rounded-[1.6rem] border border-white/10 bg-gradient-to-b from-[#2b2b33] to-[#141418] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.15)] md:h-32">
                <div className="absolute top-5 left-6 flex gap-1.5">
                  {["#00AEEF", "#E52B91", "#F7E500", "#111"].map((c) => (
                    <span key={c} className="h-6 w-3 rounded-sm border border-white/10" style={{ background: c }} />
                  ))}
                </div>
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <span className="size-2 animate-pulse rounded-full bg-[#25D366]" />
                  <span className="font-sub text-[0.65rem] tracking-[0.2em] text-white/50 uppercase">Imprimindo</span>
                </div>
                <div className="absolute inset-x-8 bottom-3 h-2 rounded-full bg-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]" />
              </div>
              <div className="mx-auto h-4 w-[84%] rounded-b-xl bg-gradient-to-b from-[#18181d] to-[#0c0c0f]" />
            </div>

            {/* Folha */}
            <div data-sheet-wrap className="absolute inset-x-[14%] top-[15%] bottom-[2%] z-10 [transform:rotateX(18deg)] [transform-origin:top]">
              <div data-sheet className="relative h-full overflow-hidden rounded-[4px] bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
                {(["c", "m", "y", "k"] as const).map((ch) => (
                  <ArtLayer key={ch} channel={ch} />
                ))}
                <div
                  data-head
                  aria-hidden
                  className="absolute inset-x-0 z-10 h-[3px] -translate-y-1/2 [--ink:#00AEEF] motion-reduce:hidden"
                  style={{ top: "0%", background: "var(--ink)", boxShadow: "0 0 18px 4px var(--ink)" }}
                />
                <div data-shine aria-hidden className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
