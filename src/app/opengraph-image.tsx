import { ImageResponse } from "next/og";

export const alt = "J.A Odontologia Estética — Harmonização facial e odontologia estética em Santos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#F0EEEC",
          color: "#252525",
          padding: 80,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 680 }}>
          <div style={{ fontSize: 22, letterSpacing: 8, textTransform: "uppercase", color: "#6F5D59" }}>
            Odontologia estética · Santos
          </div>
          <div style={{ fontSize: 76, lineHeight: 1.05, marginTop: 30, fontWeight: 300 }}>
            Realce sua beleza. Preserve sua essência.
          </div>
        </div>
        <div
          style={{
            width: 300,
            height: 300,
            borderRadius: 300,
            background: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 40px 80px -30px rgba(37,37,37,0.35)",
          }}
        >
          <div style={{ fontSize: 120, fontWeight: 200, letterSpacing: -14 }}>JA</div>
          <div style={{ fontSize: 13, letterSpacing: 5, marginTop: 6 }}>ODONTOLOGIA ESTÉTICA</div>
        </div>
      </div>
    ),
    size,
  );
}
