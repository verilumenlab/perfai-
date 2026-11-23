import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "PerfAI — Authorised Partner & Reseller of Senatria Physical AI";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          backgroundColor: "#071B17",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Soft background glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            backgroundColor: "rgba(35, 168, 117, 0.15)",
            filter: "blur(90px)",
          }}
        />

        {/* Top Header / Badges */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#102C25",
                border: "1px solid #23A875",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#75E6AE",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              P
            </div>
            <span style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "1px" }}>
              Perf<span style={{ color: "#75E6AE" }}>AI</span>
            </span>
          </div>

          <div
            style={{
              padding: "8px 20px",
              borderRadius: "9999px",
              backgroundColor: "#102C25",
              border: "1px solid rgba(117, 230, 174, 0.3)",
              color: "#75E6AE",
              fontSize: "14px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Authorised Partner of SENATRIA
          </div>
        </div>

        {/* Main Center Message */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: "48px",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#FFFFFF",
              letterSpacing: "-0.5px",
            }}
          >
            <span>Make Your Infrastructure Smarter. </span>
            <span style={{ color: "#75E6AE" }}>More Efficient. More Valuable.</span>
          </div>
          <div style={{ display: "flex", fontSize: "20px", color: "#A3B8B0", lineHeight: 1.5 }}>
            <span>Enterprise deployments of Senatria Physical AI platform: ATRIA, BuildingShield, GridShield & ComputeShield.</span>
          </div>
        </div>

        {/* Bottom Footer Details */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #102C25",
            paddingTop: "24px",
            fontSize: "16px",
            color: "#75857D",
          }}
        >
          <span>https://perfai.in</span>
          <span>Commercial Buildings · Data Centres · Infrastructure</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
