import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0a0a0a 0%, #18181b 60%, #3f3f46 100%)",
          color: "white",
          padding: "64px",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 22px",
            borderRadius: "999px",
            background: "rgba(250, 204, 21, 0.14)",
            border: "2px solid rgba(250, 204, 21, 0.45)",
            color: "#fde047",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          ISTANBUL 7/24 KURYE
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 72, fontWeight: 800, lineHeight: 0.95 }}>
            <div style={{ display: "flex" }}>34 MOTO KURYE</div>
            <div style={{ display: "flex" }}>ISTANBUL</div>
          </div>
          <div style={{ fontSize: 42, color: "#f4f4f5", maxWidth: 950, lineHeight: 1.2 }}>
            Istanbul moto kurye, acil kurye ve ayni gun teslimat hizmeti
          </div>
        </div>

        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {[
            "Moto Kurye",
            "Acil Kurye",
            "VIP Kurye",
            "Ayni Gun Teslimat",
          ].map((item) => (
            <div
              key={item}
              style={{
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.06)",
                padding: "12px 18px",
                fontSize: 28,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
