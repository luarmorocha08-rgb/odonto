import type { Metadata, Viewport } from "next";
import { Montserrat, Raleway } from "next/font/google";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { Analytics } from "@/components/layout/Analytics";
import { ConsentBanner } from "@/components/layout/ConsentBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollEffects } from "@/components/layout/ScrollEffects";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { JsonLd, organizationJsonLd } from "@/lib/seo";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  style: ["normal", "italic"],
  variable: "--font-raleway",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Harmonização Facial e Odontologia Estética em Santos`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "odontologia estética em Santos",
    "harmonização facial em Santos",
    "clareamento dental em Santos",
    "clínica de odontologia estética em Santos",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Harmonização Facial e Odontologia Estética em Santos`,
    description: siteConfig.description,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#F0EEEC",
  width: "device-width",
  initialScale: 1,
};

// Marca o documento antes da pintura para que as animações iniciais não "pisquem".
const motionScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ok')}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${raleway.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
        <JsonLd data={organizationJsonLd()} />
      </head>
      <body>
        <SmoothScroll>
          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <ConsentBanner />
          <ScrollEffects />
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
