import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="font-display text-[clamp(6rem,25vw,14rem)] leading-none font-extrabold tracking-[-0.06em] italic">
          <span className="text-cyan">4</span>
          <span className="text-magenta">0</span>
          <span className="text-yellow">4</span>
        </p>
        <h1 className="mt-4 font-display text-3xl">Essa página saiu do registro.</h1>
        <p className="mt-3 text-white/65">O endereço não existe ou foi alterado.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex min-h-12 items-center rounded-full bg-paper px-6 font-sub font-semibold text-ink">
            Voltar ao início
          </Link>
          <Link href="/servicos" className="inline-flex min-h-12 items-center rounded-full border border-white/20 px-6 font-sub font-semibold">
            Ver serviços
          </Link>
        </div>
      </div>
    </main>
  );
}
