import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — gráfica rápida e comunicação visual em Guarujá/SP`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#050505", color: "#fff", padding: 72, position: "relative" }}>
        <div style={{ position: "absolute", right: 80, top: 70, width: 260, height: 260, borderRadius: 999, background: "#00AEEF", opacity: 0.9 }} />
        <div style={{ position: "absolute", right: 0, top: 120, width: 260, height: 260, borderRadius: 999, background: "#E52B91", opacity: 0.85 }} />
        <div style={{ position: "absolute", right: 60, top: 230, width: 260, height: 260, borderRadius: 999, background: "#F7E500", opacity: 0.8 }} />
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, color: "#a1a1aa", textTransform: "uppercase" }}>Guarujá · SP · Envio para todo o Brasil</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 108, fontWeight: 900, lineHeight: 0.9, letterSpacing: -4, fontStyle: "italic" }}>
          <span>GUARU</span>
          <span>PRINT</span>
        </div>
        <div style={{ display: "flex", fontSize: 38, maxWidth: 760 }}>Sua ideia merece ganhar destaque.</div>
      </div>
    ),
    size,
  );
}
