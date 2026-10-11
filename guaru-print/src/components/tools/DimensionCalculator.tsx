"use client";

import { ArrowRight, Ruler } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { calculateDimensions, formatArea, formatNumber, UNITS, type Unit } from "@/lib/units";

const PRESETS: { label: string; w: number; h: number; unit: Unit }[] = [
  { label: "A4", w: 21, h: 29.7, unit: "cm" },
  { label: "A3", w: 29.7, h: 42, unit: "cm" },
  { label: "Banner 0,8 × 1,2 m", w: 0.8, h: 1.2, unit: "m" },
  { label: "Fachada 4 × 1 m", w: 4, h: 1, unit: "m" },
  { label: "Adesivo 10 × 10 cm", w: 10, h: 10, unit: "cm" },
];

/**
 * Calculadora de dimensões: área individual e total, conversões e proporção.
 * "Usar essas medidas no orçamento" leva os valores para o formulário.
 */
export function DimensionCalculator({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const id = useId();
  const [width, setWidth] = useState("100");
  const [height, setHeight] = useState("50");
  const [unit, setUnit] = useState<Unit>("cm");
  const [quantity, setQuantity] = useState("1");
  const tracked = useRef(false);

  const w = Number(width.replace(",", "."));
  const h = Number(height.replace(",", "."));
  const q = Math.floor(Number(quantity));
  const result = useMemo(() => calculateDimensions(w, h, unit, q), [w, h, unit, q]);

  useEffect(() => {
    if (tracked.current || (width === "100" && height === "50")) return;
    tracked.current = true;
    trackEvent("calculator_use");
  }, [width, height]);

  // Referência de escala: pessoa de 1,70 m para peças grandes, folha A4 para pequenas.
  const ref = result && Math.max(result.widthM, result.heightM) >= 0.5 ? { kind: "person" as const, w: 0.45, h: 1.7 } : { kind: "a4" as const, w: 0.21, h: 0.297 };
  const scene = useMemo(() => {
    if (!result) return null;
    const spanW = result.widthM + ref.w + 0.15 * Math.max(result.widthM, ref.w);
    const spanH = Math.max(result.heightM, ref.h);
    const scale = Math.min(300 / spanW, 180 / spanH);
    return { scale, rw: result.widthM * scale, rh: result.heightM * scale, pw: ref.w * scale, ph: ref.h * scale };
  }, [result, ref.w, ref.h]);

  const useInQuote = () => {
    if (!result) return;
    const params = new URLSearchParams({ largura: String(w), altura: String(h), unidade: unit, qtd: String(q) });
    trackEvent("calculator_use", { action: "send-to-quote" });
    router.push(`/orcamento?${params.toString()}#formulario`);
  };

  const invalid = (v: number) => !(v > 0);

  return (
    <div id="calculadora" className={cn("card relative overflow-hidden p-6 md:p-10", compact && "md:p-8")}>
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-yellow text-ink">
          <Ruler className="size-5" aria-hidden />
        </span>
        <h2 className="font-display text-2xl md:text-3xl">Calculadora de medidas</h2>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Medidas prontas">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setWidth(String(p.w));
                  setHeight(String(p.h));
                  setUnit(p.unit);
                }}
                className="min-h-9 rounded-full border border-white/15 px-3 text-xs font-semibold text-white/75 transition hover:border-yellow hover:text-paper"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${id}-w`} className="label">
                Largura
              </label>
              <input id={`${id}-w`} inputMode="decimal" className="field" value={width} onChange={(e) => setWidth(e.target.value)} aria-invalid={invalid(w)} />
            </div>
            <div>
              <label htmlFor={`${id}-h`} className="label">
                Altura
              </label>
              <input id={`${id}-h`} inputMode="decimal" className="field" value={height} onChange={(e) => setHeight(e.target.value)} aria-invalid={invalid(h)} />
            </div>
            <div>
              <label htmlFor={`${id}-u`} className="label">
                Unidade
              </label>
              <select id={`${id}-u`} className="field" value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
                {UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-q`} className="label">
                Quantidade
              </label>
              <input id={`${id}-q`} inputMode="numeric" className="field" value={quantity} onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ""))} aria-invalid={invalid(q)} />
            </div>
          </div>
          {!result && <p className="mt-3 text-sm text-magenta">Informe largura, altura e quantidade maiores que zero.</p>}
        </div>

        <div aria-live="polite">
          {result && scene ? (
            <>
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 text-sm">
                <div className="bg-ink-2 p-4">
                  <dt className="text-mute">Área de cada peça</dt>
                  <dd className="mt-1 font-display text-2xl">{formatArea(result.areaM2)}</dd>
                </div>
                <div className="bg-ink-2 p-4">
                  <dt className="text-mute">Área total ({formatNumber(q, 0)} un.)</dt>
                  <dd className="mt-1 font-display text-2xl text-yellow">{formatArea(result.totalAreaM2)}</dd>
                </div>
                <div className="bg-ink-2 p-4">
                  <dt className="text-mute">Proporção</dt>
                  <dd className="mt-1 font-display text-xl">
                    {result.ratio} <span className="font-sans text-xs font-normal text-mute">({result.orientation})</span>
                  </dd>
                </div>
                <div className="bg-ink-2 p-4">
                  <dt className="text-mute">Perímetro</dt>
                  <dd className="mt-1 font-display text-xl">{formatNumber(result.perimeterM)} m</dd>
                </div>
              </dl>
              <table className="mt-4 w-full text-sm">
                <caption className="sr-only">Conversão de medidas</caption>
                <tbody>
                  {(["mm", "cm", "m"] as Unit[]).map((u) => (
                    <tr key={u} className="border-b border-white/[0.07]">
                      <th scope="row" className="py-2 text-left font-normal text-mute">
                        Em {u}
                      </th>
                      <td className="py-2 text-right font-mono">
                        {formatNumber(result.conversions[u].width, u === "m" ? 3 : 1)} × {formatNumber(result.conversions[u].height, u === "m" ? 3 : 1)} {u}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Representação visual com referência de escala */}
              <figure className="mt-6 rounded-2xl border border-white/10 bg-ink p-4">
                <svg viewBox="0 0 340 210" className="h-auto w-full" role="img" aria-label={`Peça de ${formatNumber(w)} por ${formatNumber(h)} ${unit} ao lado de ${ref.kind === "person" ? "uma pessoa de 1,70 m" : "uma folha A4"}`}>
                  <line x1="0" y1="195" x2="340" y2="195" stroke="#26262c" />
                  <g transform={`translate(20 ${195 - scene.rh})`}>
                    <rect width={Math.max(scene.rw, 1)} height={Math.max(scene.rh, 1)} fill="url(#calc-grad)" stroke="#fff" strokeOpacity="0.6" rx="2" className="transition-all duration-500" />
                    <text x={scene.rw / 2} y="-6" textAnchor="middle" fill="#a1a1aa" fontSize="10">
                      {formatNumber(w)} {unit}
                    </text>
                  </g>
                  <g transform={`translate(${20 + scene.rw + 0.15 * Math.max(scene.rw, scene.pw) + 4} ${195 - scene.ph})`}>
                    {ref.kind === "person" ? (
                      <g fill="#3a3a44">
                        <circle cx={scene.pw / 2} cy={scene.ph * 0.07} r={scene.ph * 0.065} />
                        <rect x={scene.pw * 0.18} y={scene.ph * 0.15} width={scene.pw * 0.64} height={scene.ph * 0.42} rx={scene.pw * 0.2} />
                        <rect x={scene.pw * 0.24} y={scene.ph * 0.55} width={scene.pw * 0.22} height={scene.ph * 0.45} rx="2" />
                        <rect x={scene.pw * 0.54} y={scene.ph * 0.55} width={scene.pw * 0.22} height={scene.ph * 0.45} rx="2" />
                      </g>
                    ) : (
                      <rect width={scene.pw} height={scene.ph} fill="#e9e9ee" opacity="0.85" rx="1" />
                    )}
                  </g>
                  <defs>
                    <linearGradient id="calc-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#00AEEF" stopOpacity="0.55" />
                      <stop offset="0.5" stopColor="#E52B91" stopOpacity="0.45" />
                      <stop offset="1" stopColor="#F7E500" stopOpacity="0.45" />
                    </linearGradient>
                  </defs>
                </svg>
                <figcaption className="mt-2 text-xs text-mute">Escala aproximada ao lado de {ref.kind === "person" ? "uma pessoa de 1,70 m" : "uma folha A4"}.</figcaption>
              </figure>

              <button
                type="button"
                onClick={useInQuote}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-yellow px-6 font-sub font-semibold text-ink transition hover:brightness-110 sm:w-auto"
              >
                Usar essas medidas no orçamento <ArrowRight className="size-4" aria-hidden />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
