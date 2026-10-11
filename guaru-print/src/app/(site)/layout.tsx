import type { ReactNode } from "react";
import { AssistantDialog } from "@/components/layout/AssistantDialog";
import { ConsentBanner } from "@/components/layout/ConsentBanner";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollEffects } from "@/components/layout/ScrollEffects";
import { SearchDialog } from "@/components/layout/SearchDialog";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { getServices, getSettings } from "@/lib/data/content";
import { JsonLd, localBusinessJsonLd } from "@/lib/seo";

// Conteúdo do painel é atualizado a cada 5 minutos (ou na hora, ao salvar no painel).
export const revalidate = 300;

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);
  return (
    <SmoothScroll>
      <JsonLd data={localBusinessJsonLd(settings)} />
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer services={services} settings={settings} />
      <WhatsAppFloat services={services.map(({ slug, name }) => ({ slug, name }))} />
      <SearchDialog services={services} />
      <AssistantDialog services={services} />
      <ConsentBanner />
      <ScrollEffects />
      <CustomCursor />
    </SmoothScroll>
  );
}
