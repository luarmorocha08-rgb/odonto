import type { Accent, IllustrationKey } from "@/content/types";
import { cn } from "@/lib/cn";

const ACCENT: Record<Accent, string> = { cyan: "#00AEEF", magenta: "#E52B91", yellow: "#F7E500" };

/**
 * Ilustrações vetoriais dos produtos — usadas enquanto não há fotos oficiais.
 * São desenhos próprios (sem licença de terceiros) e leves (SVG inline).
 */
export function Illustration({
  kind,
  accent = "cyan",
  className,
  title,
}: {
  kind: IllustrationKey;
  accent?: Accent;
  className?: string;
  title?: string;
}) {
  const a = ACCENT[accent];
  const id = `il-${kind}-${accent}`;
  return (
    <svg
      viewBox="0 0 400 300"
      className={cn("h-full w-full", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141418" />
          <stop offset="1" stopColor="#07070a" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={a} stopOpacity="0.55" />
          <stop offset="1" stopColor={a} stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-dots`} width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#fff" opacity="0.06" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}-bg)`} />
      <rect width="400" height="300" fill={`url(#${id}-dots)`} />
      <ellipse cx="200" cy="150" rx="190" ry="120" fill={`url(#${id}-glow)`} opacity="0.5" />
      <Scene kind={kind} a={a} id={id} />
    </svg>
  );
}

function Scene({ kind, a, id }: { kind: IllustrationKey; a: string; id: string }) {
  const shine = `url(#${id}-shine)`;
  switch (kind) {
    case "sticker":
      return (
        <g>
          <rect x="70" y="60" width="260" height="190" rx="10" fill="#1d1d23" stroke="#2c2c34" />
          <rect x="70" y="60" width="260" height="190" rx="10" fill={shine} opacity="0.4" />
          <g transform="rotate(-8 200 155)">
            <path d="M120 95h150a14 14 0 0 1 14 14v70l-40 40H120a14 14 0 0 1-14-14v-96a14 14 0 0 1 14-14Z" fill={a} />
            <path d="M284 179l-40 40v-26a14 14 0 0 1 14-14Z" fill="#fff" opacity="0.85" />
            <text x="190" y="150" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="30" fill="#050505">
              SUA
            </text>
            <text x="190" y="180" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="30" fill="#050505">
              MARCA
            </text>
          </g>
          <circle cx="318" cy="88" r="20" fill="#F7E500" />
          <circle cx="92" cy="232" r="14" fill="#00AEEF" opacity="0.9" />
        </g>
      );
    case "banner":
      return (
        <g>
          <rect x="88" y="40" width="6" height="230" fill="#3a3a44" />
          <rect x="306" y="40" width="6" height="230" fill="#3a3a44" />
          <rect x="94" y="54" width="212" height="170" fill="#fff" />
          <rect x="94" y="54" width="212" height="80" fill={a} />
          <text x="200" y="104" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="34" fill="#050505">
            OFERTA
          </text>
          <rect x="114" y="150" width="120" height="10" rx="5" fill="#050505" opacity="0.85" />
          <rect x="114" y="170" width="170" height="8" rx="4" fill="#050505" opacity="0.25" />
          <rect x="114" y="186" width="140" height="8" rx="4" fill="#050505" opacity="0.25" />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={104 + i * 64} cy="62" r="3.5" fill="#bbb" stroke="#666" />
          ))}
          <rect x="94" y="54" width="212" height="170" fill={shine} opacity="0.5" />
          <rect x="70" y="268" width="260" height="6" rx="3" fill="#2a2a32" />
        </g>
      );
    case "easel":
      return (
        <g>
          <path d="M140 270 190 60h20l50 210" fill="none" stroke="#3a3a44" strokeWidth="10" strokeLinejoin="round" />
          <path d="M150 78h100l20 170H130Z" fill="#fff" />
          <path d="M150 78h100l6 52H144Z" fill={a} />
          <text x="200" y="114" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="20" fill="#050505">
            HOJE
          </text>
          <rect x="160" y="146" width="80" height="8" rx="4" fill="#050505" opacity="0.8" />
          <rect x="156" y="166" width="90" height="6" rx="3" fill="#050505" opacity="0.25" />
          <rect x="154" y="182" width="94" height="6" rx="3" fill="#050505" opacity="0.25" />
          <rect x="152" y="198" width="98" height="6" rx="3" fill="#050505" opacity="0.25" />
          <path d="M150 78h100l20 170H130Z" fill={shine} opacity="0.5" />
        </g>
      );
    case "facade":
      return (
        <g>
          <rect x="40" y="70" width="320" height="200" fill="#1a1a20" />
          <rect x="40" y="70" width="320" height="56" fill="#0b0b0e" stroke={a} strokeOpacity="0.6" />
          <text x="200" y="108" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="28" fill="#fff" style={{ filter: `drop-shadow(0 0 8px ${a})` }}>
            SUA LOJA
          </text>
          <rect x="62" y="146" width="130" height="124" fill="#2a3a48" opacity="0.7" />
          <rect x="208" y="146" width="130" height="124" fill="#2a3a48" opacity="0.7" />
          <rect x="62" y="146" width="130" height="124" fill={shine} opacity="0.35" />
          <rect x="208" y="146" width="130" height="124" fill={shine} opacity="0.35" />
          <rect x="76" y="196" width="100" height="22" rx="3" fill={a} opacity="0.9" />
          <circle cx="273" cy="207" r="20" fill="#F7E500" opacity="0.9" />
          <rect x="20" y="268" width="360" height="8" fill="#2a2a32" />
        </g>
      );
    case "lightbox":
      return (
        <g>
          <rect x="40" y="40" width="320" height="220" rx="8" fill="#101015" />
          <g style={{ filter: `drop-shadow(0 0 14px ${a})` }}>
            <text x="200" y="168" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="64" fill="#fff" stroke={a} strokeWidth="2">
              OPEN
            </text>
          </g>
          <rect x="120" y="190" width="160" height="4" rx="2" fill={a} opacity="0.9" />
          <circle cx="80" cy="80" r="4" fill={a} />
          <circle cx="320" cy="80" r="4" fill={a} />
        </g>
      );
    case "flyer":
      return (
        <g>
          <g transform="rotate(-10 160 160)">
            <rect x="90" y="60" width="140" height="196" rx="4" fill="#e9e9ee" />
            <rect x="90" y="60" width="140" height="70" fill="#00AEEF" />
          </g>
          <g transform="rotate(6 230 150)">
            <rect x="170" y="50" width="140" height="196" rx="4" fill="#fff" />
            <rect x="170" y="50" width="140" height="90" fill={a} />
            <text x="240" y="104" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="24" fill="#050505">
              PROMO
            </text>
            <rect x="186" y="156" width="90" height="8" rx="4" fill="#050505" opacity="0.8" />
            <rect x="186" y="174" width="108" height="6" rx="3" fill="#050505" opacity="0.25" />
            <rect x="186" y="188" width="96" height="6" rx="3" fill="#050505" opacity="0.25" />
            <rect x="186" y="214" width="56" height="18" rx="9" fill="#050505" />
            <rect x="170" y="50" width="140" height="196" fill={shine} opacity="0.4" />
          </g>
        </g>
      );
    case "prints":
      return (
        <g>
          <g transform="rotate(-6 150 170)">
            <rect x="70" y="120" width="170" height="100" rx="8" fill="#050505" stroke="#2c2c34" />
            <circle cx="104" cy="170" r="18" fill={a} />
            <rect x="132" y="158" width="86" height="8" rx="4" fill="#fff" />
            <rect x="132" y="174" width="60" height="6" rx="3" fill="#fff" opacity="0.4" />
          </g>
          <g transform="rotate(5 260 140)">
            <rect x="190" y="80" width="170" height="100" rx="8" fill="#fff" />
            <rect x="190" y="80" width="170" height="16" rx="8" fill={a} />
            <rect x="206" y="118" width="100" height="8" rx="4" fill="#050505" />
            <rect x="206" y="134" width="70" height="6" rx="3" fill="#050505" opacity="0.35" />
            <rect x="190" y="80" width="170" height="100" fill={shine} opacity="0.5" />
          </g>
          <rect x="250" y="196" width="56" height="74" rx="6" fill="#F7E500" transform="rotate(12 278 233)" />
          <circle cx="278" cy="212" r="5" fill="#050505" transform="rotate(12 278 233)" />
        </g>
      );
    case "signage":
      return (
        <g>
          <rect x="196" y="60" width="8" height="214" fill="#3a3a44" />
          <path d="M90 78h180l26 22-26 22H90Z" fill={a} />
          <text x="170" y="108" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="20" fill="#050505">
            RECEPÇÃO
          </text>
          <path d="M310 140H130l-26 22 26 22h180Z" fill="#fff" />
          <text x="214" y="170" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="20" fill="#050505">
            SALA 02
          </text>
          <rect x="120" y="204" width="160" height="40" rx="4" fill="#F7E500" />
          <text x="200" y="230" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="16" fill="#050505">
            SAÍDA →
          </text>
        </g>
      );
  }
}
