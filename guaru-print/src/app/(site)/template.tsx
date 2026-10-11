"use client";

import { useEffect, useState, type ReactNode } from "react";

let firstLoad = true;

/**
 * Transição entre páginas inspirada em impressão: três passadas de tinta
 * (ciano, magenta, amarelo) atravessam a tela e revelam a próxima página.
 * Não roda no primeiro carregamento nem com movimento reduzido.
 */
export default function Template({ children }: { children: ReactNode }) {
  const [play] = useState(() => {
    if (typeof window === "undefined") return false;
    const should = !firstLoad && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    firstLoad = false;
    return should;
  });
  const [done, setDone] = useState(!play);

  useEffect(() => {
    if (!play) return;
    const id = window.setTimeout(() => setDone(true), 1100);
    return () => window.clearTimeout(id);
  }, [play]);

  return (
    <>
      {!done && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[80]">
          {["#00AEEF", "#E52B91", "#F7E500", "#050505"].map((c, i) => (
            <span
              key={c}
              className="page-wipe absolute inset-0"
              style={{ background: c, animationDelay: `${(3 - i) * 70}ms` }}
            />
          ))}
        </div>
      )}
      {children}
    </>
  );
}
