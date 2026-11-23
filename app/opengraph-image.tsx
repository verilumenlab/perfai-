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
          backgroundColor: "#F0F4F2",
          color: "#0C1612",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.5px", color: "#0C1612" }}>
            PerfAI
          </span>

          <div
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              backgroundColor: "#E4EBE7",
              border: "1px solid rgba(12, 22, 18, 0.1)",
              color: "#0F5C45",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            Authorised Partner of SENATRIA
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: "48px",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#0C1612",
              letterSpacing: "-0.5px",
            }}
          >
            <span>Make Your Infrastructure Smarter. More Efficient. More Valuable.</span>
          </div>
          <div style={{ display: "flex", fontSize: "20px", color: "#5A6B64", lineHeight: 1.5 }}>
            <span>Enterprise deployments of Senatria Physical AI platform: ATRIA, BuildingShield, GridShield & ComputeShield.</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(12, 22, 18, 0.1)",
            paddingTop: "24px",
            fontSize: "16px",
            color: "#5A6B64",
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
