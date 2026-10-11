import { AlertTriangle, Check, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Guia de preparação de arquivos para impressão",
  description: "Resolução, sangria, margens de segurança, CMYK e RGB, formatos de arquivo e cuidados antes de imprimir. Prepare sua arte do jeito certo.",
  path: "/guia-de-impressao",
});

const TOC = [
  { id: "resolucao", label: "Resolução" },
  { id: "sangria", label: "Sangria" },
  { id: "margens", label: "Margens de segurança" },
  { id: "cores", label: "CMYK e RGB" },
  { id: "formatos", label: "Formatos de arquivo" },
  { id: "checklist", label: "Antes de enviar" },
];

function Section({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-white/10 py-14" aria-labelledby={`${id}-t`}>
      <p className="font-mono text-sm text-mute">{n}</p>
      <h2 id={`${id}-t`} className="display-md mt-2">
        {title}
      </h2>
      <div className="mt-6 space-y-5 text-lg leading-relaxed text-white/75 [&_strong]:text-paper">{children}</div>
    </section>
  );
}

export default function GuidePage() {
  return (
    <>
      <PageHeader
        eyebrow="Guia de impressão"
        title={
          <>
            Prepare seu arquivo <span className="text-cmyk">como um profissional.</span>
          </>
        }
        description="Um arquivo bem preparado evita retrabalho, atrasos e surpresas na cor. Veja o essencial antes de enviar sua arte."
        crumbs={[{ name: "Guia de impressão", path: "/guia-de-impressao" }]}
      />
      <div className="container-x grid gap-12 pb-24 lg:grid-cols-[16rem_1fr]">
        <nav aria-label="Neste guia" className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-4">Neste guia</p>
          <ol className="space-y-1">
            {TOC.map((t, i) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="flex min-h-10 items-center gap-3 text-white/70 hover:text-paper">
                  <span className="font-mono text-xs text-mute">0{i + 1}</span> {t.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="max-w-3xl">
          <Section id="resolucao" n="01" title="Resolução">
            <p>
              Resolução é a quantidade de pixels por polegada (<strong>DPI</strong>). Imagens com resolução baixa ficam serrilhadas ou borradas quando ampliadas.
            </p>
            <ul className="space-y-2">
              <li>
                <strong>Impressos de mão</strong> (panfletos, cartões): o padrão de mercado é <strong>300 DPI</strong> no tamanho final.
              </li>
              <li>
                <strong>Peças grandes</strong> (banners, fachadas): vistas de longe, costumam aceitar resolução menor. A equipe confirma o mínimo para o seu caso.
              </li>
              <li>
                Sempre que possível, use <strong>vetor</strong> (PDF vetorial, SVG, AI, EPS) para logotipos e textos — vetores não perdem qualidade em nenhum tamanho.
              </li>
            </ul>
            <div className="rounded-2xl border border-white/10 bg-ink-2 p-5 text-base">
              <p className="font-sub font-semibold text-paper">Conta rápida</p>
              <p className="mt-1">Pixels necessários = (tamanho em cm ÷ 2,54) × DPI. Ex.: um panfleto A5 (14,8 cm) a 300 DPI precisa de cerca de 1.748 px de largura.</p>
            </div>
          </Section>

          <Section id="sangria" n="02" title="Sangria">
            <p>
              Sangria é uma <strong>margem extra de fundo</strong> que ultrapassa o tamanho final e é removida no corte. Ela evita filetes brancos na borda caso o corte varie milímetros.
            </p>
            <figure className="rounded-2xl border border-white/10 bg-ink-2 p-6">
              <svg viewBox="0 0 400 240" className="mx-auto h-auto w-full max-w-md" role="img" aria-label="Diagrama de sangria, linha de corte e margem de segurança">
                <rect x="20" y="20" width="360" height="200" fill="#E52B91" opacity="0.35" />
                <rect x="40" y="40" width="320" height="160" fill="#E52B91" opacity="0.6" />
                <rect x="40" y="40" width="320" height="160" fill="none" stroke="#fff" strokeDasharray="6 4" />
                <rect x="62" y="62" width="276" height="116" fill="none" stroke="#00AEEF" strokeWidth="2" />
                <text x="200" y="125" textAnchor="middle" fill="#fff" fontSize="14">área segura para textos</text>
                <text x="26" y="14" fill="#ffb3da" fontSize="11">sangria</text>
                <text x="290" y="34" fill="#fff" fontSize="11">linha de corte</text>
                <text x="250" y="194" fill="#7fdcff" fontSize="11">margem de segurança</text>
              </svg>
            </figure>
            <p>
              Em impressos pequenos, use em geral <strong>2 a 3 mm</strong> de sangria em cada lado; em banners, cerca de <strong>1 cm</strong>. Confirme com a equipe a medida para o seu produto.
            </p>
          </Section>

          <Section id="margens" n="03" title="Margens de segurança">
            <p>
              Textos, logotipos e informações importantes devem ficar <strong>afastados do corte</strong>. Uma margem interna de <strong>3 a 5 mm</strong> em impressos (e maior em peças grandes, ilhós e bastões) evita que algo seja cortado ou fique escondido no acabamento.
            </p>
          </Section>

          <Section id="cores" n="04" title="CMYK e RGB">
            <p>
              Telas exibem cores em <strong>RGB</strong> (luz). A impressão usa <strong>CMYK</strong> (tintas ciano, magenta, amarelo e preto). Algumas cores muito vibrantes da tela — neons, azuis e verdes intensos — não têm equivalente exato em tinta.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 p-5">
                <div className="flex h-14 overflow-hidden rounded-lg">
                  <span className="flex-1 bg-[#00ff66]" />
                  <span className="flex-1 bg-[#0066ff]" />
                  <span className="flex-1 bg-[#ff00ff]" />
                </div>
                <p className="mt-3 font-sub text-base font-semibold text-paper">RGB — tela</p>
                <p className="text-sm">Mais luminoso, pode mudar na impressão.</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-5">
                <div className="flex h-14 overflow-hidden rounded-lg">
                  <span className="flex-1 bg-[#3aa860]" />
                  <span className="flex-1 bg-[#2f5fb0]" />
                  <span className="flex-1 bg-[#c2338f]" />
                </div>
                <p className="mt-3 font-sub text-base font-semibold text-paper">CMYK — impressão</p>
                <p className="text-sm">Aproximação de como as tintas reproduzem.</p>
              </div>
            </div>
            <p className="flex items-start gap-2 text-base">
              <AlertTriangle className="mt-1 size-4 shrink-0 text-yellow" aria-hidden /> Os quadros acima são apenas ilustrativos — o resultado depende do material, da tinta e do equipamento.
            </p>
            <p>
              Para <strong>preto intenso</strong> em áreas grandes, consulte a equipe sobre a composição recomendada. Para textos pequenos, use preto 100% K.
            </p>
          </Section>

          <Section id="formatos" n="05" title="Formatos de arquivo">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-base">
                <thead className="text-sm text-mute">
                  <tr>
                    <th scope="col" className="py-2 pr-4 font-normal">
                      Formato
                    </th>
                    <th scope="col" className="py-2 pr-4 font-normal">
                      Quando usar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-paper">PDF</td>
                    <td className="py-3">Preferido. Exporte em alta qualidade, com fontes incorporadas ou convertidas em curvas.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-paper">SVG</td>
                    <td className="py-3">Vetores simples, como logotipos e recortes de adesivo.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-paper">PNG</td>
                    <td className="py-3">Imagens com fundo transparente, em alta resolução.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-paper">JPG</td>
                    <td className="py-3">Fotografias, sempre na maior qualidade disponível.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-base">Pelo site, cada arquivo pode ter até 25 MB. Arquivos maiores podem ser enviados por link (Google Drive, WeTransfer) na conversa do WhatsApp.</p>
          </Section>

          <Section id="checklist" n="06" title="Cuidados antes de enviar">
            <ul className="space-y-3 text-base">
              {[
                "Arte no tamanho final (ou proporcional), com sangria",
                "Textos revisados — ortografia, telefones e endereços",
                "Fontes convertidas em curvas ou incorporadas ao PDF",
                "Imagens com resolução adequada ao tamanho",
                "Cores em CMYK sempre que possível",
                "Informações importantes dentro da margem de segurança",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-cyan" aria-hidden /> {t}
                </li>
              ))}
              {["Prints de tela ou imagens copiadas de redes sociais para peças grandes", "Textos colados na borda do corte"].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <X className="mt-1 size-4 shrink-0 text-magenta" aria-hidden /> Evite: {t.toLowerCase()}
                </li>
              ))}
            </ul>
            <p className="text-base">
              Ainda com dúvida? Envie o arquivo mesmo assim pelo{" "}
              <Link href="/orcamento" className="text-cyan underline underline-offset-4">
                orçamento
              </Link>{" "}
              — a equipe avalia e orienta os ajustes necessários.
            </p>
          </Section>
        </article>
      </div>
      <CtaBand title="Arquivo pronto? Vamos imprimir." />
    </>
  );
}
