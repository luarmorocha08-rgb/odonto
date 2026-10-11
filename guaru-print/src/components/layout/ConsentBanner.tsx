"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { readConsent, writeConsent } from "@/lib/consent";

const hasTracking = Boolean(siteConfig.analytics.ga4Id || siteConfig.analytics.metaPixelId);

/** Aviso de cookies (LGPD). Só aparece quando há ferramenta de medição configurada. */
export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!hasTracking) return;
    const id = window.setTimeout(() => setShow(readConsent() === null), 1500);
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
          className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-lg rounded-3xl border border-line bg-ink-2/95 p-5 shadow-2xl backdrop-blur-xl md:left-6 md:mx-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-sm leading-relaxed text-white/80">
            Usamos cookies de medição para entender como o site é usado e melhorar sua experiência. Saiba mais na{" "}
            <Link href="/politica-de-privacidade" className="underline underline-offset-4">
              Política de Privacidade
            </Link>
            .
          </p>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => decide("granted")} className="min-h-11 rounded-full bg-paper px-5 text-sm font-semibold text-ink">
              Aceitar
            </button>
            <button type="button" onClick={() => decide("denied")} className="min-h-11 rounded-full border border-white/20 px-5 text-sm font-semibold">
              Recusar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
