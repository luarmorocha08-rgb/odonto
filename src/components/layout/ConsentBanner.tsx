"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { readConsent, writeConsent } from "@/lib/consent";

const hasTracking = Boolean(siteConfig.analytics.ga4Id || siteConfig.analytics.metaPixelId);

/**
 * Aviso de cookies (LGPD). Só aparece quando existe alguma ferramenta de
 * medição configurada — sem GA4/Meta Pixel, o site não usa cookies de terceiros.
 */
export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!hasTracking) return;
    const id = window.setTimeout(() => setShow(readConsent() === null), 1200);
    return () => window.clearTimeout(id);
  }, []);

  const decide = (value: "granted" | "denied") => {
    writeConsent(value);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="region"
          aria-label="Preferências de cookies"
          className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-xl rounded-3xl border border-ink/10 bg-white/90 p-5 shadow-[0_30px_60px_-30px_rgba(37,37,37,0.5)] backdrop-blur-xl md:bottom-8 md:left-8 md:mx-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-sm leading-relaxed text-ink/80">
            Usamos cookies de medição para entender como o site é utilizado e melhorar sua experiência. Nenhum dado de
            saúde é compartilhado. Saiba mais na{" "}
            <Link href="/politica-de-privacidade" className="underline underline-offset-4">
              Política de Privacidade
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => decide("granted")}
              className="min-h-11 rounded-full bg-ink px-5 text-[0.8rem] font-medium text-offwhite"
            >
              Aceitar
            </button>
            <button
              type="button"
              onClick={() => decide("denied")}
              className="min-h-11 rounded-full border border-ink/20 px-5 text-[0.8rem] font-medium"
            >
              Recusar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
