"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/whatsapp";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5.1 5.24-1.37A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.82.83-3.03-.2-.31a8.2 8.2 0 1 1 6.95 3.85Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.22-.08-.39-.12-.55.13-.16.24-.63.8-.78.96-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.66.31 2.77 2.77 0 0 0-.86 2.06 4.8 4.8 0 0 0 1 2.55 11 11 0 0 0 4.21 3.72c1.57.68 2.18.74 2.97.62.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

/** Botão flutuante do WhatsApp — aparece após o início da página. */
export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Agendar avaliação pelo WhatsApp (abre em nova aba)"
          onClick={() => trackEvent("whatsapp_click", { location: "floating", channel: "whatsapp" })}
          className="group fixed right-4 bottom-4 z-40 flex items-center gap-3 rounded-full bg-ink py-2 pr-2 pl-5 text-offwhite ring-1 ring-offwhite/15 shadow-[0_20px_40px_-18px_rgba(37,37,37,0.6)] md:right-8 md:bottom-8"
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -3 }}
        >
          <span className="hidden text-[0.75rem] font-medium tracking-[0.06em] sm:inline">Agendar avaliação</span>
          <span className="relative grid size-11 place-items-center rounded-full bg-taupe text-ink">
            <span className="absolute inset-0 animate-ping rounded-full bg-taupe opacity-30 [animation-duration:2.6s]" />
            <WhatsAppIcon className="relative size-5" />
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

export { WhatsAppIcon };
