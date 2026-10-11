import type { Metadata } from "next";
import { Simulator } from "@/components/tools/Simulator";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Simulador visual de produtos",
  description: "Envie sua arte e veja como ela fica em adesivo, banner, placa, fachada ou cavalete. Ajuste escala, posição e medidas e salve a prévia.",
  path: "/simulador",
});

export default function SimulatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Simulador"
        title={
          <>
            Veja sua arte <span className="text-cmyk">aplicada.</span>
          </>
        }
        description="Escolha o produto, envie sua imagem, ajuste escala e posição e salve uma prévia para compartilhar."
        crumbs={[{ name: "Simulador", path: "/simulador" }]}
      />
      <section className="pb-28" aria-label="Simulador visual">
        <div className="container-x">
          <Simulator />
        </div>
      </section>
    </>
  );
}
