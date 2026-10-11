"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const PearlScene = dynamic(() => import("./PearlScene"), { ssr: false });

/** Versão estática (CSS) usada em celulares, com movimento reduzido ou antes do 3D carregar. */
function StaticPearl() {
  return (
    <div aria-hidden className="absolute inset-[18%] rounded-full shadow-[0_40px_80px_-30px_rgba(37,37,37,0.45)] [background:radial-gradient(circle_at_34%_30%,#fff_0%,#f3ece9_28%,#d8cbc6_62%,#a18d89_100%)]">
      <div className="absolute inset-[-14%] rotate-[18deg] rounded-full border border-taupe-deep/40 [transform:rotateX(70deg)]" />
    </div>
  );
}

/**
 * Elemento 3D decorativo. O Three.js só é carregado em telas maiores, sem
 * preferência por movimento reduzido e quando a área está próxima da tela.
 */
export function Pearl({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const supportsWebGL = (() => {
      try {
        return Boolean(document.createElement("canvas").getContext("webgl2"));
      } catch {
        return false;
      }
    })();
    const update = () => setEnabled(query.matches && supportsWebGL);
    update();
    query.addEventListener("change", update);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      {
        rootMargin: "200px",
      },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      query.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={cn("relative aspect-square", className)}>
      {enabled && seen ? (
        <div className="absolute inset-0">
          <PearlScene active={visible} />
        </div>
      ) : (
        <StaticPearl />
      )}
    </div>
  );
}
