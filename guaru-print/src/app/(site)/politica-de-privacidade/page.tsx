import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Política de Privacidade",
  description: "Como a Guaru Print trata os dados enviados pelo site, em conformidade com a LGPD.",
  path: "/politica-de-privacidade",
});

/** Texto-base — revise com a empresa/assessoria jurídica antes da publicação. */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="LGPD" title="Política de Privacidade" crumbs={[{ name: "Privacidade", path: "/politica-de-privacidade" }]} />
      <article className="container-x max-w-3xl space-y-8 pb-28 leading-relaxed text-white/75 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-paper">
        <section>
          <h2>Quais dados coletamos</h2>
          <p className="mt-3">
            Ao solicitar um orçamento, você informa nome, WhatsApp, cidade e, se quiser, e-mail, CEP, observações e arquivos de arte. O site não exige cadastro nem senha.
          </p>
        </section>
        <section>
          <h2>Para que usamos</h2>
          <p className="mt-3">Exclusivamente para analisar seu pedido, responder com o orçamento e combinar produção e entrega. Não vendemos nem compartilhamos seus dados para publicidade.</p>
        </section>
        <section>
          <h2>Arquivos enviados</h2>
          <p className="mt-3">
            As artes ficam em armazenamento privado. O acesso acontece apenas por links temporários enviados na sua mensagem e pela equipe da {siteConfig.name}. A lista de orçamento fica salva apenas no seu navegador até o envio.
          </p>
        </section>
        <section>
          <h2>Cookies e medição</h2>
          <p className="mt-3">Ferramentas de medição (como Google Analytics e Meta Pixel) só são carregadas se você aceitar no aviso de cookies. Você pode recusar sem prejuízo ao uso do site.</p>
        </section>
        <section>
          <h2>Seus direitos</h2>
          <p className="mt-3">
            Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelo WhatsApp {siteConfig.whatsapp.display} ou pelo Instagram {siteConfig.instagram.handle}.
          </p>
        </section>
      </article>
    </>
  );
}
