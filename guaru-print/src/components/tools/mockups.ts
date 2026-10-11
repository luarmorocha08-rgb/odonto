/**
 * Mockups do simulador, desenhados em canvas (sem imagens de terceiros).
 * Cada mockup define a cena e a "área de impressão" onde a arte é aplicada.
 * A área usa as proporções reais informadas pelo cliente (largura × altura).
 */
export type MockupKey = "adesivo" | "banner" | "placa" | "fachada" | "cavalete";

export type Area = { x: number; y: number; w: number; h: number };

export type Mockup = {
  key: MockupKey;
  label: string;
  hint: string;
  defaultSize: { w: number; h: number; unit: "cm" | "m" };
  /** Caixa máxima (em px do canvas 1200×800) que a peça pode ocupar. */
  bounds: Area;
  /** Desenha o fundo; recebe a área calculada da peça. */
  drawBack: (ctx: CanvasRenderingContext2D, area: Area, bg?: HTMLImageElement | null) => void;
  /** Detalhes por cima da arte (reflexos, ilhós, moldura). */
  drawFront?: (ctx: CanvasRenderingContext2D, area: Area) => void;
  /** Permite enviar foto própria de fundo (ex.: a fachada do cliente). */
  customBackground?: boolean;
};

export const W = 1200;
export const H = 800;

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function floor(ctx: CanvasRenderingContext2D, y: number, color = "#16161b") {
  const g = ctx.createLinearGradient(0, y, 0, H);
  g.addColorStop(0, color);
  g.addColorStop(1, "#050505");
  ctx.fillStyle = g;
  ctx.fillRect(0, y, W, H - y);
}

function wall(ctx: CanvasRenderingContext2D, top: string, bottom: string) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function shine(ctx: CanvasRenderingContext2D, a: Area, alpha = 0.18) {
  const g = ctx.createLinearGradient(a.x, a.y, a.x + a.w, a.y + a.h);
  g.addColorStop(0, `rgba(255,255,255,${alpha})`);
  g.addColorStop(0.35, "rgba(255,255,255,0)");
  g.addColorStop(0.7, "rgba(255,255,255,0)");
  g.addColorStop(1, `rgba(255,255,255,${alpha * 0.5})`);
  ctx.fillStyle = g;
  ctx.fillRect(a.x, a.y, a.w, a.h);
}

function cover(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
  const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const w = img.naturalWidth * s;
  const h = img.naturalHeight * s;
  ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
}

export const MOCKUPS: Mockup[] = [
  {
    key: "adesivo",
    label: "Adesivo",
    hint: "Aplicado em uma vitrine de vidro",
    defaultSize: { w: 60, h: 60, unit: "cm" },
    bounds: { x: 330, y: 150, w: 540, h: 460 },
    drawBack(ctx) {
      wall(ctx, "#1a1d22", "#0d0f12");
      // Moldura da vitrine
      ctx.fillStyle = "#2a2d33";
      ctx.fillRect(180, 60, 840, 640);
      const g = ctx.createLinearGradient(200, 80, 1000, 680);
      g.addColorStop(0, "#3a4b5c");
      g.addColorStop(1, "#18212b");
      ctx.fillStyle = g;
      ctx.fillRect(200, 80, 800, 600);
      // Interior desfocado da loja
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      for (let i = 0; i < 6; i++) ctx.fillRect(240 + i * 125, 420, 90, 220);
      floor(ctx, 700, "#121216");
    },
    drawFront(ctx) {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const g = ctx.createLinearGradient(200, 80, 700, 680);
      g.addColorStop(0, "rgba(255,255,255,0.14)");
      g.addColorStop(0.3, "rgba(255,255,255,0)");
      g.addColorStop(0.55, "rgba(255,255,255,0.06)");
      g.addColorStop(0.6, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(200, 80, 800, 600);
      ctx.restore();
    },
  },
  {
    key: "banner",
    label: "Banner",
    hint: "Lona instalada em estrutura com ilhós",
    defaultSize: { w: 0.8, h: 1.2, unit: "m" },
    bounds: { x: 380, y: 90, w: 440, h: 560 },
    drawBack(ctx, a) {
      wall(ctx, "#1c1c22", "#0b0b0e");
      floor(ctx, 690);
      // Estrutura (pedestal)
      ctx.fillStyle = "#3a3a44";
      ctx.fillRect(a.x + a.w / 2 - 6, a.y + a.h, 12, 690 - (a.y + a.h));
      ctx.fillRect(a.x - 14, a.y - 16, a.w + 28, 10);
      ctx.fillRect(a.x - 14, a.y + a.h + 6, a.w + 28, 10);
      ctx.fillRect(a.x + a.w / 2 - 110, 680, 220, 14);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.beginPath();
      ctx.ellipse(a.x + a.w / 2, 700, 200, 16, 0, 0, Math.PI * 2);
      ctx.fill();
    },
    drawFront(ctx, a) {
      shine(ctx, a, 0.12);
      // ilhós
      const n = Math.max(2, Math.round(a.w / 140) + 1);
      for (let i = 0; i < n; i++) {
        for (const y of [a.y + 14, a.y + a.h - 14]) {
          const x = a.x + 14 + ((a.w - 28) / (n - 1)) * i;
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.fillStyle = "#c9c9d1";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = "#222";
          ctx.fill();
        }
      }
    },
  },
  {
    key: "placa",
    label: "Placa",
    hint: "Placa em ACM fixada na parede",
    defaultSize: { w: 1.2, h: 0.6, unit: "m" },
    bounds: { x: 200, y: 170, w: 800, h: 420 },
    drawBack(ctx, a) {
      wall(ctx, "#5b5e63", "#3b3d41");
      // textura de reboco
      ctx.fillStyle = "rgba(255,255,255,0.025)";
      for (let i = 0; i < 400; i++) ctx.fillRect((i * 97) % W, (i * 53) % H, 3, 3);
      floor(ctx, 720, "#2a2a2f");
      // sombra da placa
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      roundRect(ctx, a.x + 14, a.y + 18, a.w, a.h, 10);
      ctx.fill();
      ctx.fillStyle = "#1a1a1f";
      roundRect(ctx, a.x - 8, a.y - 8, a.w + 16, a.h + 16, 12);
      ctx.fill();
    },
    drawFront(ctx, a) {
      shine(ctx, a, 0.16);
      for (const [x, y] of [
        [a.x + 18, a.y + 18],
        [a.x + a.w - 18, a.y + 18],
        [a.x + 18, a.y + a.h - 18],
        [a.x + a.w - 18, a.y + a.h - 18],
      ]) {
        const g = ctx.createRadialGradient(x - 2, y - 2, 1, x, y, 9);
        g.addColorStop(0, "#fff");
        g.addColorStop(1, "#7a7a84");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  {
    key: "fachada",
    label: "Fachada",
    hint: "Envie uma foto da sua fachada e posicione a placa",
    defaultSize: { w: 4, h: 1, unit: "m" },
    bounds: { x: 120, y: 90, w: 960, h: 300 },
    customBackground: true,
    drawBack(ctx, a, bg) {
      if (bg) {
        cover(ctx, bg);
      } else {
        wall(ctx, "#7c8a99", "#c5ccd3");
        ctx.fillStyle = "#8e8a84";
        ctx.fillRect(60, 60, 1080, 680);
        for (const x of [120, 640]) {
          const g = ctx.createLinearGradient(x, 430, x + 440, 720);
          g.addColorStop(0, "#4a5d70");
          g.addColorStop(1, "#1e2934");
          ctx.fillStyle = g;
          ctx.fillRect(x, 430, 440, 290);
          ctx.strokeStyle = "#5d5a55";
          ctx.lineWidth = 10;
          ctx.strokeRect(x, 430, 440, 290);
        }
        ctx.fillStyle = "#6f6b66";
        ctx.fillRect(0, 740, W, 60);
      }
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(a.x + 10, a.y + 14, a.w, a.h);
    },
    drawFront(ctx, a) {
      shine(ctx, a, 0.12);
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 2;
      ctx.strokeRect(a.x, a.y, a.w, a.h);
    },
  },
  {
    key: "cavalete",
    label: "Cavalete",
    hint: "Cavalete de calçada",
    defaultSize: { w: 60, h: 90, unit: "cm" },
    bounds: { x: 430, y: 140, w: 340, h: 470 },
    drawBack(ctx, a) {
      wall(ctx, "#20232a", "#0e0f12");
      floor(ctx, 680, "#2b2b30");
      // pernas
      ctx.strokeStyle = "#2f2f37";
      ctx.lineWidth = 16;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(a.x - 10, 700);
      ctx.lineTo(a.x + a.w / 2, a.y - 40);
      ctx.lineTo(a.x + a.w + 10, 700);
      ctx.stroke();
      ctx.fillStyle = "#1b1b20";
      ctx.fillRect(a.x - 16, a.y - 16, a.w + 32, a.h + 32);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.beginPath();
      ctx.ellipse(a.x + a.w / 2, 706, a.w * 0.75, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    },
    drawFront(ctx, a) {
      shine(ctx, a, 0.14);
    },
  },
];

export const MOCKUP_MAP = Object.fromEntries(MOCKUPS.map((m) => [m.key, m])) as Record<MockupKey, Mockup>;

/** Calcula a área da peça respeitando a proporção real dentro dos limites do mockup. */
export function fitArea(bounds: Area, ratio: number): Area {
  let w = bounds.w;
  let h = w / ratio;
  if (h > bounds.h) {
    h = bounds.h;
    w = h * ratio;
  }
  return { x: bounds.x + (bounds.w - w) / 2, y: bounds.y + (bounds.h - h) / 2, w, h };
}
