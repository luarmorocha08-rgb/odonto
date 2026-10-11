export type Unit = "mm" | "cm" | "m";

export const UNITS: { value: Unit; label: string }[] = [
  { value: "cm", label: "Centímetros (cm)" },
  { value: "mm", label: "Milímetros (mm)" },
  { value: "m", label: "Metros (m)" },
];

const TO_METERS: Record<Unit, number> = { mm: 0.001, cm: 0.01, m: 1 };

export function toMeters(value: number, unit: Unit) {
  return value * TO_METERS[unit];
}

export function convert(value: number, from: Unit, to: Unit) {
  return (value * TO_METERS[from]) / TO_METERS[to];
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** Proporção simplificada (ex.: 16:9). Usa décimos para medidas quebradas. */
export function aspectRatio(width: number, height: number) {
  if (!(width > 0 && height > 0)) return null;
  const w = Math.round(width * 10);
  const h = Math.round(height * 10);
  const d = gcd(w, h);
  const a = w / d;
  const b = h / d;
  // Proporções "feias" (ex.: 137:89) são mostradas em decimal.
  if (a > 50 || b > 50) return `${(width / height).toFixed(2).replace(".", ",")}:1`;
  return `${a}:${b}`;
}

export type DimensionResult = {
  widthM: number;
  heightM: number;
  areaM2: number;
  totalAreaM2: number;
  perimeterM: number;
  ratio: string | null;
  orientation: "horizontal" | "vertical" | "quadrado";
  conversions: Record<Unit, { width: number; height: number }>;
};

export function calculateDimensions(width: number, height: number, unit: Unit, quantity: number): DimensionResult | null {
  if (!(width > 0 && height > 0 && quantity > 0)) return null;
  const widthM = toMeters(width, unit);
  const heightM = toMeters(height, unit);
  const areaM2 = widthM * heightM;
  return {
    widthM,
    heightM,
    areaM2,
    totalAreaM2: areaM2 * Math.floor(quantity),
    perimeterM: 2 * (widthM + heightM),
    ratio: aspectRatio(width, height),
    orientation: width === height ? "quadrado" : width > height ? "horizontal" : "vertical",
    conversions: {
      mm: { width: convert(width, unit, "mm"), height: convert(height, unit, "mm") },
      cm: { width: convert(width, unit, "cm"), height: convert(height, unit, "cm") },
      m: { width: convert(width, unit, "m"), height: convert(height, unit, "m") },
    },
  };
}

const nf = (digits: number) => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: digits });

export function formatNumber(value: number, digits = 2) {
  return nf(digits).format(value);
}

export function formatArea(m2: number) {
  if (m2 < 0.01) return `${nf(2).format(m2 * 10000)} cm²`;
  return `${nf(m2 < 1 ? 4 : 2).format(m2)} m²`;
}
