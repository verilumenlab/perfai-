import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "PerfAI — Channel Partner for Building Management Services";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const logoBytes = await readFile(
    join(process.cwd(), "public/images/brand/perfai-logo-light.jpg")
  );
  const logoSrc = `data:image/jpeg;base64,${logoBytes.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
          backgroundColor: "#F1FAF6",
          color: "#0C1612",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img
            src={logoSrc}
            alt="perfai"
            width={360}
            height={90}
            style={{ objectFit: "contain", objectPosition: "left center" }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: "46px",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#14251F",
              letterSpacing: "-0.5px",
            }}
          >
            <span>
              Make Your Buildings Smarter. More Efficient. Better Managed.
            </span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "20px",
              color: "#62766E",
              lineHeight: 1.5,
            }}
          >
            <span>
              Channel partner for building management services: HVAC, energy
              monitoring, BMS integration and facility operations.
            </span>
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
            color: "#62766E",
          }}
        >
          <span>https://perfai.in</span>
          <span>Commercial Buildings · Facilities · BMS</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
