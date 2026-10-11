"use client";

import { AlertTriangle, ArrowRight, Download, ImagePlus, Info, Maximize, Minimize, Move, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { ACCEPT_ATTR } from "@/lib/files";
import { checkFile } from "@/lib/files-client";
import { UNITS, type Unit } from "@/lib/units";
import { fitArea, H, MOCKUP_MAP, MOCKUPS, W, type Area, type MockupKey } from "./mockups";

type Fit = "cover" | "contain";

const QUOTE_PRODUCT: Record<MockupKey, string> = { adesivo: "adesivo", banner: "banner", placa: "placa", fachada: "fachada", cavalete: "cavalete" };

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/** Arte de exemplo enquanto o cliente não envia a sua. */
function drawPlaceholderArt(ctx: CanvasRenderingContext2D, a: Area) {
  const g = ctx.createLinearGradient(a.x, a.y, a.x + a.w, a.y + a.h);
  g.addColorStop(0, "#00AEEF");
  g.addColorStop(0.5, "#E52B91");
  g.addColorStop(1, "#F7E500");
  ctx.fillStyle = g;
  ctx.fillRect(a.x, a.y, a.w, a.h);
  ctx.fillStyle = "#050505";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-montserrat") || "sans-serif";
  ctx.font = `italic 800 100px ${family}`;
  // Ajusta o tamanho para o texto caber em 85% da largura.
  const size = Math.min((100 * a.w * 0.85) / ctx.measureText("SUA ARTE AQUI").width, a.h / 3);
  ctx.font = `italic 800 ${size}px ${family}`;
  ctx.fillText("SUA ARTE AQUI", a.x + a.w / 2, a.y + a.h / 2);
}

/**
 * Simulador visual: o cliente envia uma imagem e vê a arte aplicada em
 * adesivo, banner, placa, fachada ou cavalete. Ajuste de escala, posição e
 * dimensões; exportação da prévia em PNG.
 */
export function Simulator() {
  const id = useId();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [mockup, setMockup] = useState<MockupKey>("adesivo");
  const [art, setArt] = useState<{ img: HTMLImageElement; url: string; name: string } | null>(null);
  const [bg, setBg] = useState<{ img: HTMLImageElement; url: string } | null>(null);
  const [fit, setFit] = useState<Fit>("contain");
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [piece, setPiece] = useState({ x: 0, y: 0, s: 1 });
  const [mode, setMode] = useState<"art" | "piece">("art");
  const [width, setWidth] = useState(String(MOCKUP_MAP.adesivo.defaultSize.w));
  const [height, setHeight] = useState(String(MOCKUP_MAP.adesivo.defaultSize.h));
  const [unit, setUnit] = useState<Unit>(MOCKUP_MAP.adesivo.defaultSize.unit);
  const [error, setError] = useState<string | null>(null);
  const [usedOnce, setUsedOnce] = useState(false);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number; px: number; py: number } | null>(null);

  const def = MOCKUP_MAP[mockup];
  const w = Number(width.replace(",", "."));
  const h = Number(height.replace(",", "."));
  const ratio = w > 0 && h > 0 ? w / h : def.defaultSize.w / def.defaultSize.h;

  const area = useMemo(() => {
    const base = fitArea(def.bounds, ratio);
    if (!def.customBackground) return base;
    const s = piece.s;
    return { x: base.x + piece.x + (base.w * (1 - s)) / 2, y: base.y + piece.y + (base.h * (1 - s)) / 2, w: base.w * s, h: base.h * s };
  }, [def, ratio, piece]);

  const markUsed = useCallback(() => {
    if (usedOnce) return;
    setUsedOnce(true);
    trackEvent("simulator_use", { service: mockup });
  }, [usedOnce, mockup]);

  // Renderização
  const draw = useCallback(
    (watermark = false) => {
      const cv = canvas.current;
      const ctx = cv?.getContext("2d");
      if (!cv || !ctx) return;
      ctx.clearRect(0, 0, W, H);
      def.drawBack(ctx, area, bg?.img);
      ctx.save();
      ctx.beginPath();
      ctx.rect(area.x, area.y, area.w, area.h);
      ctx.clip();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(area.x, area.y, area.w, area.h);
      if (art) {
        const iw = art.img.naturalWidth || 800;
        const ih = art.img.naturalHeight || 600;
        const base = fit === "cover" ? Math.max(area.w / iw, area.h / ih) : Math.min(area.w / iw, area.h / ih);
        const s = base * scale;
        const dw = iw * s;
        const dh = ih * s;
        ctx.drawImage(art.img, area.x + (area.w - dw) / 2 + offset.x * area.w, area.y + (area.h - dh) / 2 + offset.y * area.h, dw, dh);
      } else {
        drawPlaceholderArt(ctx, area);
      }
      ctx.restore();
      def.drawFront?.(ctx, area);

      // Cotas
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "600 18px system-ui, sans-serif";
      ctx.textAlign = "center";
      if (w > 0 && h > 0) {
        ctx.fillText(`${width} ${unit}`, area.x + area.w / 2, Math.max(22, area.y - 22));
        ctx.save();
        ctx.translate(Math.min(W - 16, area.x + area.w + 26), area.y + area.h / 2);
        ctx.rotate(Math.PI / 2);
        ctx.fillText(`${height} ${unit}`, 0, 0);
        ctx.restore();
      }
      ctx.restore();

      if (watermark) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, H - 44, W, 44);
        ctx.fillStyle = "#fff";
        ctx.font = "500 16px system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("Simulação ilustrativa — Guaru Print · cores, materiais e medidas finais dependem da análise técnica", 20, H - 17);
      }
    },
    [def, area, bg, art, fit, scale, offset, w, h, width, height, unit],
  );

  useEffect(() => {
    draw();
  }, [draw]);

  // Redesenha quando as fontes carregarem (texto do placeholder).
  useEffect(() => {
    document.fonts?.ready.then(() => draw());
  }, [draw]);

  useEffect(() => () => {
    if (art) URL.revokeObjectURL(art.url);
  }, [art]);
  useEffect(() => () => {
    if (bg) URL.revokeObjectURL(bg.url);
  }, [bg]);

  const chooseMockup = (key: MockupKey) => {
    const d = MOCKUP_MAP[key];
    setMockup(key);
    setWidth(String(d.defaultSize.w));
    setHeight(String(d.defaultSize.h));
    setUnit(d.defaultSize.unit);
    setPiece({ x: 0, y: 0, s: 1 });
    setMode("art");
  };

  const onFile = async (file: File | undefined, target: "art" | "bg") => {
    if (!file) return;
    setError(null);
    const res = await checkFile(file);
    if (!res.ok) return setError(res.error);
    if (res.value.kind === "pdf") return setError("Para a prévia, envie PNG, JPG ou SVG. PDFs podem ser enviados normalmente no orçamento.");
    const url = res.value.previewUrl ?? URL.createObjectURL(file);
    try {
      const img = await loadImage(url);
      if (target === "art") {
        setArt({ img, url, name: file.name });
        setScale(1);
        setOffset({ x: 0, y: 0 });
        markUsed();
      } else {
        setBg({ img, url });
        setMode("piece");
      }
    } catch {
      setError("Não foi possível abrir a imagem.");
    }
  };

  // Arrastar (mouse e toque)
  const toCanvas = (dx: number, dy: number) => {
    const r = canvas.current!.getBoundingClientRect();
    return { x: (dx * W) / r.width, y: (dy * H) / r.height };
  };
  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y, px: piece.x, py: piece.y };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current) return;
    const d = toCanvas(e.clientX - drag.current.x, e.clientY - drag.current.y);
    if (mode === "piece" && def.customBackground) setPiece((p) => ({ ...p, x: drag.current!.px + d.x, y: drag.current!.py + d.y }));
    else setOffset({ x: drag.current.ox + d.x / area.w, y: drag.current.oy + d.y / area.h });
    markUsed();
  };
  const onPointerUp = () => (drag.current = null);

  const nudge = (dx: number, dy: number) => {
    if (mode === "piece" && def.customBackground) setPiece((p) => ({ ...p, x: p.x + dx * 20, y: p.y + dy * 20 }));
    else setOffset((o) => ({ x: o.x + dx * 0.02, y: o.y + dy * 0.02 }));
  };
  const zoom = (factor: number) => {
    if (mode === "piece" && def.customBackground) setPiece((p) => ({ ...p, s: Math.min(2.5, Math.max(0.2, p.s * factor)) }));
    else setScale((s) => Math.min(4, Math.max(0.1, s * factor)));
  };

  const reset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setPiece({ x: 0, y: 0, s: 1 });
  };

  const exportPng = () => {
    draw(true);
    try {
      canvas.current!.toBlob((blob) => {
        draw();
        if (!blob) return setError("Não foi possível gerar a imagem.");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `guaru-print-simulacao-${mockup}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
        trackEvent("simulator_export", { service: mockup });
      }, "image/png");
    } catch {
      draw();
      setError("Seu navegador bloqueou a exportação desta imagem. Tente com PNG ou JPG.");
    }
  };

  const quoteHref = `/orcamento?${new URLSearchParams({ produto: QUOTE_PRODUCT[mockup], largura: String(w || ""), altura: String(h || ""), unidade: unit, qtd: "1" }).toString()}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="min-w-0">
        <div role="tablist" aria-label="Produto para simular" className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1 lg:mx-0 lg:px-0">
          {MOCKUPS.map((m) => (
            <button
              key={m.key}
              type="button"
              role="tab"
              aria-selected={mockup === m.key}
              onClick={() => chooseMockup(m.key)}
              className={cn("min-h-11 shrink-0 rounded-full border px-5 font-sub text-sm font-semibold transition", mockup === m.key ? "border-paper bg-paper text-ink" : "border-white/15 text-white/75 hover:border-white/40")}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="relative mt-4 overflow-hidden rounded-[1.5rem] border border-white/10 bg-ink-2">
          <canvas
            ref={canvas}
            width={W}
            height={H}
            tabIndex={0}
            role="img"
            aria-label={`Simulação: arte aplicada em ${def.label.toLowerCase()} de ${width} × ${height} ${unit}. Use as setas para mover e + ou − para ajustar a escala.`}
            className="block h-auto w-full touch-none focus-visible:outline-2 focus-visible:outline-yellow"
            style={{ cursor: "grab" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={(e) => {
              const k: Record<string, () => void> = {
                ArrowLeft: () => nudge(-1, 0),
                ArrowRight: () => nudge(1, 0),
                ArrowUp: () => nudge(0, -1),
                ArrowDown: () => nudge(0, 1),
                "+": () => zoom(1.1),
                "=": () => zoom(1.1),
                "-": () => zoom(1 / 1.1),
              };
              if (k[e.key]) {
                e.preventDefault();
                k[e.key]();
              }
            }}
          />
          <p className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white/80 backdrop-blur">
            <Move className="size-3.5" aria-hidden /> Arraste para posicionar {mode === "piece" && def.customBackground ? "a placa" : "a arte"}
          </p>
        </div>
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-mute">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Simulação ilustrativa, sem garantia de fidelidade de impressão. Cores, materiais e dimensões finais dependem da análise técnica da equipe.
        </p>
      </div>

      <div className="space-y-5">
        <div className="card p-5">
          <p className="font-sub font-semibold">1. Sua arte</p>
          <label htmlFor={`${id}-art`} className="mt-3 flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 px-4 text-sm font-semibold transition hover:border-cyan hover:bg-cyan/5">
            <ImagePlus className="size-5 text-cyan" aria-hidden />
            {art ? "Trocar imagem" : "Enviar imagem"}
          </label>
          <input id={`${id}-art`} type="file" accept={ACCEPT_ATTR} className="sr-only" onChange={(e) => (void onFile(e.target.files?.[0], "art"), (e.target.value = ""))} />
          {art && <p className="mt-2 truncate text-xs text-mute">{art.name}</p>}
          {def.customBackground && (
            <>
              <label htmlFor={`${id}-bg`} className="mt-3 flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 text-sm font-semibold transition hover:border-white/40">
                <ImagePlus className="size-4" aria-hidden /> {bg ? "Trocar foto da fachada" : "Foto da minha fachada"}
              </label>
              <input id={`${id}-bg`} type="file" accept="image/png,image/jpeg" capture="environment" className="sr-only" onChange={(e) => (void onFile(e.target.files?.[0], "bg"), (e.target.value = ""))} />
              <div className="mt-3 grid grid-cols-2 gap-1 rounded-full bg-white/5 p-1" role="radiogroup" aria-label="O que arrastar">
                {(["art", "piece"] as const).map((m) => (
                  <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => setMode(m)} className={cn("min-h-9 rounded-full text-xs font-semibold", mode === m ? "bg-paper text-ink" : "text-white/70")}>
                    {m === "art" ? "Mover arte" : "Mover placa"}
                  </button>
                ))}
              </div>
            </>
          )}
          {error && (
            <p role="alert" className="mt-3 flex items-start gap-2 text-xs text-[#ff8cc6]">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden /> {error}
            </p>
          )}
        </div>

        <div className="card p-5">
          <p className="font-sub font-semibold">2. Ajustes</p>
          <div className="mt-3 grid grid-cols-2 gap-1 rounded-full bg-white/5 p-1" role="radiogroup" aria-label="Encaixe da arte">
            {(["contain", "cover"] as const).map((f) => (
              <button key={f} type="button" role="radio" aria-checked={fit === f} onClick={() => setFit(f)} className={cn("inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full text-xs font-semibold", fit === f ? "bg-paper text-ink" : "text-white/70")}>
                {f === "contain" ? <Minimize className="size-3.5" aria-hidden /> : <Maximize className="size-3.5" aria-hidden />}
                {f === "contain" ? "Inteira" : "Preencher"}
              </button>
            ))}
          </div>
          <label htmlFor={`${id}-scale`} className="label mt-4">
            Escala {mode === "piece" && def.customBackground ? "da placa" : "da arte"}
          </label>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => zoom(1 / 1.1)} className="grid size-10 place-items-center rounded-full bg-white/5 hover:bg-white/10" aria-label="Diminuir">
              <ZoomOut className="size-4" />
            </button>
            <input
              id={`${id}-scale`}
              type="range"
              min={10}
              max={mode === "piece" && def.customBackground ? 250 : 400}
              value={Math.round((mode === "piece" && def.customBackground ? piece.s : scale) * 100)}
              onChange={(e) => {
                const v = Number(e.target.value) / 100;
                if (mode === "piece" && def.customBackground) setPiece((p) => ({ ...p, s: v }));
                else setScale(v);
              }}
              className="flex-1 accent-cyan"
            />
            <button type="button" onClick={() => zoom(1.1)} className="grid size-10 place-items-center rounded-full bg-white/5 hover:bg-white/10" aria-label="Aumentar">
              <ZoomIn className="size-4" />
            </button>
          </div>
          <button type="button" onClick={reset} className="mt-3 inline-flex min-h-9 items-center gap-1.5 text-xs text-mute hover:text-paper">
            <RotateCcw className="size-3.5" aria-hidden /> Centralizar
          </button>

          <fieldset className="mt-4">
            <legend className="label">Dimensões da peça</legend>
            <div className="grid grid-cols-[1fr_1fr_5.5rem] gap-2">
              <input aria-label="Largura" inputMode="decimal" className="field" value={width} onChange={(e) => setWidth(e.target.value)} />
              <input aria-label="Altura" inputMode="decimal" className="field" value={height} onChange={(e) => setHeight(e.target.value)} />
              <select aria-label="Unidade" className="field px-3" value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
                {UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.value}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>
        </div>

        <div className="card space-y-3 p-5">
          <p className="font-sub font-semibold">3. Resultado</p>
          <button type="button" onClick={exportPng} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20 font-sub text-sm font-semibold hover:border-white/50">
            <Download className="size-4" aria-hidden /> Salvar prévia (PNG)
          </button>
          <Link href={quoteHref} onClick={() => trackEvent("quote_start", { location: "simulator", service: mockup })} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-paper font-sub text-sm font-semibold text-ink hover:bg-cyan">
            Solicitar orçamento <ArrowRight className="size-4" aria-hidden />
          </Link>
          <p className="text-xs text-mute">No orçamento, anexe sua arte original e, se quiser, a prévia salva.</p>
        </div>
      </div>
    </div>
  );
}
