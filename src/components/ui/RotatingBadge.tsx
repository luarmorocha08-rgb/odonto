import { useId } from "react";

/** Selo circular com texto girando lentamente (pausa com movimento reduzido). */
export function RotatingBadge({ text, size = 132 }: { text: string; size?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <div
      aria-hidden
      className="relative grid place-items-center rounded-full bg-offwhite/60 backdrop-blur-sm"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_24s_linear_infinite]">
        <defs>
          <path id={`c-${id}`} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-ink font-sans text-[6.4px] font-medium uppercase">
          <textPath href={`#c-${id}`} textLength="236" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <svg viewBox="0 0 24 24" className="size-5 text-taupe-deep" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19" />
      </svg>
    </div>
  );
}
