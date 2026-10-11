"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";

/**
 * Mapa do Google carregado somente após o clique — evita cookies de terceiros
 * antes do consentimento e não pesa no carregamento inicial.
 */
export function MapEmbed({ query }: { query: string }) {
  const [loaded, setLoaded] = useState(false);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=17&output=embed`;

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] bg-blush">
      {loaded ? (
        <iframe
          title="Mapa da localização da clínica"
          src={src}
          className="absolute inset-0 size-full border-0 grayscale-[0.6] sepia-[0.15]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="group absolute inset-0 grid place-items-center text-center"
        >
          <span aria-hidden className="absolute inset-0 opacity-50 [background:repeating-linear-gradient(0deg,transparent_0_38px,rgba(37,37,37,.06)_38px_39px),repeating-linear-gradient(90deg,transparent_0_38px,rgba(37,37,37,.06)_38px_39px)]" />
          <span className="relative flex flex-col items-center gap-3">
            <span className="grid size-14 place-items-center rounded-full bg-offwhite transition-transform duration-500 group-hover:scale-110">
              <MapPin strokeWidth={1.3} className="size-6" />
            </span>
            <span className="text-sm font-medium">Carregar mapa interativo</span>
            <span className="max-w-60 text-xs text-ink/60">O mapa é fornecido pelo Google e pode usar cookies.</span>
          </span>
        </button>
      )}
    </div>
  );
}
