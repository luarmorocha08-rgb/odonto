import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Poppins } from "next/font/google";
import type { ReactNode } from "react";
import { Analytics } from "@/components/layout/Analytics";
import { siteConfig } from "@/config/site";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["700", "800"], style: ["normal", "italic"], variable: "--font-montserrat", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-poppins", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const defaultTitle = `${siteConfig.name} | Gráfica rápida e comunicação visual em Guarujá`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: defaultTitle, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "gráfica em Guarujá",
    "gráfica rápida em Guarujá",
    "adesivos personalizados",
    "fachadas comerciais",
    "comunicação visual",
    "banners personalizados",
    "impressão de panfletos",
    "letreiros e luminosos",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: defaultTitle,
    description: siteConfig.description,
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: siteConfig.description },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const motionScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ok')}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${poppins.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
