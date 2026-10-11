import { CtaBand } from "@/components/sections/CtaBand";
import { Differentials } from "@/components/sections/Differentials";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Marquee } from "@/components/sections/Marquee";
import { ServicesShowcase } from "@/components/sections/ServicesShowcase";
import { CmykBurst } from "@/components/scroll/CmykBurst";
import { FacadeTransform } from "@/components/scroll/FacadeTransform";
import { HorizontalGallery } from "@/components/scroll/HorizontalGallery";
import { PrintingPress } from "@/components/scroll/PrintingPress";
import { StickerApply } from "@/components/scroll/StickerApply";
import { BeforeAfterSection } from "@/components/sections/BeforeAfterSection";
import { ToolsTeaser } from "@/components/sections/ToolsTeaser";
import { getFaq, getProjects, getServices } from "@/lib/data/content";

export default async function HomePage() {
  const [services, projects, faq] = await Promise.all([getServices(), getProjects(), getFaq()]);
  const beforeAfter = projects.find((p) => p.beforeImage && p.afterImage) ?? null;
  return (
    <>
      <Hero />
      <Marquee />
      <PrintingPress />
      <ServicesShowcase services={services} />
      <StickerApply />
      <CmykBurst />
      <FacadeTransform />
      <Differentials />
      <HorizontalGallery projects={projects} />
      <BeforeAfterSection project={beforeAfter} />
      <HowItWorks />
      <ToolsTeaser />
      <Faq items={faq} />
      <CtaBand />
    </>
  );
}
