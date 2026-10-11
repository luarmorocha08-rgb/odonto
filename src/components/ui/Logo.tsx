import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  /** "full" exibe o monograma com a assinatura; "mark" apenas o monograma. */
  variant?: "full" | "mark";
  tone?: "ink" | "light";
};

/** Monograma JA reconstruído em tipografia (substituível pelo arquivo oficial do logotipo). */
export function Logo({ className, variant = "full", tone = "ink" }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 select-none",
        tone === "ink" ? "text-ink" : "text-offwhite",
        className,
      )}
    >
      <span
        aria-hidden
        className="font-display text-[2.1rem] leading-none font-extralight tracking-[-0.14em]"
      >
        J<span className="-ml-[0.02em]">A</span>
      </span>
      {variant === "full" && (
        <span aria-hidden className="hidden flex-col sm:flex">
          <span className="h-px w-6 bg-current opacity-40" />
          <span className="mt-1.5 text-[0.55rem] font-medium tracking-[0.32em] uppercase">
            Odontologia
          </span>
          <span className="text-[0.55rem] font-medium tracking-[0.32em] uppercase">Estética</span>
        </span>
      )}
      <span className="sr-only">J.A Odontologia Estética</span>
    </span>
  );
}
