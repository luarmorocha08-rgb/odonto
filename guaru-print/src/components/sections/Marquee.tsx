const WORDS = ["Adesivos", "Banners", "Cavaletes", "Fachadas", "Letreiros", "Luminosos", "Panfletos", "Impressos", "Sinalização"];
const COLORS = ["#00AEEF", "#E52B91", "#F7E500"];

/** Faixa tipográfica em movimento contínuo (pausa com movimento reduzido). */
export function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {WORDS.map((w, i) => (
        <li key={w} className="flex items-center gap-10">
          <span className="font-display text-[clamp(2.5rem,7vw,6rem)] font-extrabold tracking-[-0.05em] uppercase italic">{w}</span>
          <span className="size-4 rounded-full md:size-6" style={{ background: COLORS[i % 3] }} />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="relative overflow-hidden border-y border-white/[0.07] py-6 md:py-10">
      <p className="sr-only">Produtos: {WORDS.join(", ")}.</p>
      <div className="marquee-track flex w-max">
        {row(true)}
        {row(true)}
      </div>
    </div>
  );
}
