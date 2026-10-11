import { useId } from "react";
import type { ArtVariant } from "@/content/types";
import { cn } from "@/lib/cn";

type Props = {
  variant?: ArtVariant;
  className?: string;
  /** Exibe a etiqueta "Imagem ilustrativa" (desligada por padrão). */
  showLabel?: boolean;
  tone?: "light" | "deep";
};

/**
 * Ilustração editorial na identidade da marca (arcos, linhas finas, pérola).
 * Usada no lugar das fotografias enquanto não houver imagens oficiais; é
 * decorativa e fica oculta para leitores de tela.
 */
export function ArtPlaceholder({ variant = "arch", className, showLabel = false, tone = "light" }: Props) {
  const id = useId().replace(/:/g, "");
  const stroke = tone === "deep" ? "#F0EEEC" : "#252525";

  return (
    <div
      className={cn(
        "grain absolute inset-0 overflow-hidden",
        tone === "deep" ? "bg-[#8f7c78]" : "bg-blush",
        className,
      )}
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="0.4" y2="1">
            {tone === "deep" ? (
              <>
                <stop offset="0" stopColor="#B4A29E" />
                <stop offset="0.55" stopColor="#A18D89" />
                <stop offset="1" stopColor="#7d6b67" />
              </>
            ) : (
              <>
                <stop offset="0" stopColor="#F4F1EF" />
                <stop offset="0.5" stopColor="#E6DCD8" />
                <stop offset="1" stopColor="#CDBCB7" />
              </>
            )}
          </linearGradient>
          <radialGradient id={`glow-${id}`} cx="0.62" cy="0.32" r="0.55">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`pearl-${id}`} cx="0.38" cy="0.32" r="0.75">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.45" stopColor="#EFE7E4" />
            <stop offset="1" stopColor="#B9A6A2" />
          </radialGradient>
        </defs>

        <rect width="400" height="500" fill={`url(#bg-${id})`} />
        <rect width="400" height="500" fill={`url(#glow-${id})`} />

        <g fill="none" stroke={stroke} strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
          {variant === "portrait" && (
            <>
              <path d="M70 500 V230 A130 130 0 0 1 330 230 V500" />
              <path d="M95 500 V236 A105 105 0 0 1 305 236 V500" opacity="0.5" />
              <circle cx="200" cy="250" r="62" fill={`url(#pearl-${id})`} stroke="none" opacity="0.95" />
              <ellipse cx="200" cy="250" rx="118" ry="34" transform="rotate(-18 200 250)" opacity="0.6" />
              <path d="M30 420 C120 380 280 380 370 420" opacity="0.45" />
            </>
          )}

          {variant === "profile" && (
            <>
              <circle cx="232" cy="210" r="150" opacity="0.35" />
              <path d="M150 40 C215 34 258 84 262 146 C264 178 262 198 274 222 L301 268 C306 279 298 287 286 288 C281 299 289 304 291 311 C285 317 283 322 289 330 C291 341 283 349 274 351 C276 371 278 386 266 401 C248 421 220 426 200 442 L198 500" />
              <path d="M150 40 C110 46 82 80 76 130" opacity="0.4" />
              <circle cx="232" cy="210" r="4" fill={stroke} stroke="none" opacity="0.6" />
            </>
          )}

          {variant === "lips" && (
            <>
              <circle cx="200" cy="250" r="168" opacity="0.3" />
              <path d="M88 252 C132 216 170 206 190 223 C195 228 205 228 210 223 C230 206 268 216 312 252" />
              <path d="M88 252 C146 304 254 304 312 252" />
              <path d="M88 252 C150 262 250 262 312 252" opacity="0.7" />
              <path d="M150 284 C175 292 225 292 250 284" opacity="0.35" />
            </>
          )}

          {variant === "smile" && (
            <>
              <circle cx="200" cy="250" r="170" opacity="0.3" />
              <path d="M80 220 C140 330 260 330 320 220" />
              <path d="M80 220 C150 252 250 252 320 220" />
              <path d="M108 240 C160 262 240 262 292 240" opacity="0.5" />
              <path d="M160 248 V262 M200 252 V266 M240 248 V262" opacity="0.35" />
            </>
          )}

          {variant === "arch" && (
            <>
              <path d="M90 500 V210 A110 110 0 0 1 310 210 V500" />
              <path d="M120 500 V214 A80 80 0 0 1 280 214 V500" opacity="0.6" />
              <path d="M150 500 V220 A50 50 0 0 1 250 220 V500" opacity="0.35" />
              <circle cx="200" cy="140" r="18" fill={`url(#pearl-${id})`} stroke="none" />
            </>
          )}

          {variant === "clinic" && (
            <>
              <path d="M60 500 V190 A90 90 0 0 1 240 190 V500" />
              <circle cx="310" cy="170" r="52" />
              <circle cx="310" cy="170" r="52" fill={`url(#pearl-${id})`} stroke="none" opacity="0.6" />
              <path d="M262 300 H380 M262 360 H380" opacity="0.7" />
              <path d="M0 430 H400" opacity="0.4" />
              <rect x="285" y="270" width="18" height="30" rx="9" opacity="0.6" />
              <rect x="320" y="330" width="26" height="30" rx="4" opacity="0.6" />
            </>
          )}
        </g>
      </svg>

      {showLabel && (
        <span
          className={cn(
            "absolute bottom-4 left-4 z-[2] rounded-full px-3 py-1 text-[0.6rem] font-medium tracking-[0.2em] uppercase backdrop-blur-sm",
            tone === "deep" ? "bg-ink/15 text-offwhite" : "bg-white/50 text-ink/70",
          )}
        >
          Imagem ilustrativa
        </span>
      )}
    </div>
  );
}
