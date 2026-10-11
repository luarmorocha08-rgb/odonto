import { cn } from "@/lib/cn";

/**
 * Logotipo tipográfico baseado na identidade do perfil oficial.
 * Substitua por `public/brand/logo.svg` quando o arquivo vetorial oficial
 * estiver disponível.
 */
export function Logo({ className, withTag = false }: { className?: string; withTag?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 select-none", className)}>
      <span className="relative inline-flex flex-col font-display leading-[0.78] font-extrabold tracking-[-0.06em] uppercase italic">
        <span className="text-[1.15em]">Guaru</span>
        <span className="text-[1.15em]">Print</span>
        <svg viewBox="0 0 30 26" className="absolute -top-[0.35em] -right-[0.95em] h-[0.95em]" aria-hidden>
          <circle cx="9" cy="10" r="8" fill="#00AEEF" />
          <circle cx="19" cy="8" r="7" fill="#E52B91" style={{ mixBlendMode: "screen" }} />
          <circle cx="17" cy="17" r="7" fill="#F7E500" style={{ mixBlendMode: "screen" }} />
        </svg>
      </span>
      {withTag && (
        <span className="ml-3 hidden font-sub text-[0.6rem] font-semibold tracking-[0.2em] text-mute uppercase sm:inline">
          Gráfica rápida
        </span>
      )}
      <span className="sr-only">Guaru Print — página inicial</span>
    </span>
  );
}
