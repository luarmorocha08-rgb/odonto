import { ButtonLink } from "@/components/ui/CtaLink";

export default function NotFound() {
  return (
    <section className="container-lux flex min-h-[80svh] flex-col items-start justify-center pt-32 pb-20">
      <p className="eyebrow text-taupe-deep">Erro 404</p>
      <h1 className="mt-6 font-display text-headline font-extralight">Página não encontrada.</h1>
      <p className="mt-4 max-w-md text-ink/70">O conteúdo que você procura pode ter mudado de endereço.</p>
      <ButtonLink href="/" variant="solid" className="mt-10">
        Voltar ao início
      </ButtonLink>
    </section>
  );
}
