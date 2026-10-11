import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Política de Privacidade",
  description: "Como a J.A Odontologia Estética trata os dados pessoais coletados pelo site, conforme a LGPD.",
  path: "/politica-de-privacidade",
});

const Placeholder = ({ children }: { children: string }) => (
  <span className="rounded bg-blush px-1.5 py-0.5 text-[0.9em]">[{children}]</span>
);

export default function PrivacyPage() {
  const { company, responsible, email } = siteConfig;
  const controller = company.legalName ?? siteConfig.name;

  return (
    <article className="container-lux pt-32 pb-28 md:pt-44">
      <p className="eyebrow text-taupe-deep">LGPD · Lei nº 13.709/2018</p>
      <h1 className="mt-6 max-w-3xl font-display text-headline font-extralight tracking-[-0.03em]">
        Política de Privacidade
      </h1>
      <p className="mt-6 text-sm text-ink/60">
        Modelo base — revise com assessoria jurídica antes da publicação. Última atualização:{" "}
        <Placeholder>data</Placeholder>
      </p>

      <div className="mt-14 max-w-3xl space-y-10 text-[0.98rem] leading-relaxed text-ink/80 [&_h2]:mb-3 [&_h2]:font-sans [&_h2]:text-lg [&_h2]:font-medium [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
        <section>
          <h2>1. Quem somos</h2>
          <p>
            Este site pertence a {controller}
            {company.cnpj ? `, inscrita no CNPJ ${company.cnpj}` : ""}, clínica de odontologia estética e harmonização
            facial localizada em Santos — SP, que atua como controladora dos dados pessoais tratados por meio dele.
            Responsável técnica:{" "}
            {responsible.name ?? <Placeholder>nome</Placeholder>} —{" "}
            {responsible.cro ?? <Placeholder>CRO</Placeholder>}
            .
          </p>
        </section>

        <section>
          <h2>2. Quais dados coletamos</h2>
          <ul>
            <li>
              <strong>Formulário de contato:</strong> nome, telefone, tratamento de interesse e mensagem opcional. Não
              solicitamos informações de saúde neste formulário.
            </li>
            <li>
              <strong>WhatsApp:</strong> ao clicar nos botões de agendamento, você é direcionado ao WhatsApp, que possui
              política de privacidade própria.
            </li>
            <li>
              <strong>Dados de navegação:</strong> somente com o seu consentimento, utilizamos ferramentas de medição
              (como Google Analytics e Meta Pixel) para entender o uso do site. Esses dados não incluem informações de
              saúde nem os dados preenchidos no formulário.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Para que usamos</h2>
          <ul>
            <li>Responder às suas solicitações e agendar avaliações (base legal: consentimento e procedimentos preliminares a pedido do titular).</li>
            <li>Melhorar a experiência e a comunicação do site (base legal: consentimento).</li>
            <li>Cumprir obrigações legais e regulatórias, quando aplicável.</li>
          </ul>
        </section>

        <section>
          <h2>4. Compartilhamento</h2>
          <p>
            Não vendemos dados pessoais. Os dados podem ser processados por fornecedores que viabilizam o
            funcionamento do site (hospedagem, mensageria e, quando autorizadas, ferramentas de medição), sempre
            limitados à finalidade descrita.
          </p>
        </section>

        <section>
          <h2>5. Por quanto tempo guardamos</h2>
          <p>
            Os dados de contato são mantidos pelo tempo necessário para atender à sua solicitação e cumprir
            obrigações legais. Prazo de retenção: <Placeholder>definir prazo</Placeholder>.
          </p>
        </section>

        <section>
          <h2>6. Seus direitos</h2>
          <p>
            Você pode solicitar a confirmação de tratamento, acesso, correção, anonimização, portabilidade,
            eliminação dos dados e revogação do consentimento, a qualquer momento, pelo contato abaixo. Também é
            possível alterar sua escolha sobre cookies limpando os dados do site no navegador.
          </p>
        </section>

        <section>
          <h2>7. Contato do encarregado (DPO)</h2>
          <p>
            Para exercer seus direitos ou tirar dúvidas: {email ?? <Placeholder>e-mail do encarregado</Placeholder>}.
          </p>
        </section>
      </div>
    </article>
  );
}
