import { ImageResponse } from "next/og";
import { bio, siteMeta } from "@/content/bio";

export const alt = siteMeta.description;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Link preview: the same graph paper and typography the site opens with, so a
 * shared link looks like the page it points at.
 */
export default function Image() {
  const areas = ["AI / ML", "ROBOTICS", "SOFTWARE ENGINEERING"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FAFAF9",
          backgroundImage:
            "linear-gradient(to right, #C9D6E3 1px, transparent 1px), linear-gradient(to bottom, #C9D6E3 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 6,
              color: "#6B7280",
            }}
          >
            PORTFOLIO
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 82,
              fontWeight: 600,
              color: "#1C1E21",
              letterSpacing: -3,
            }}
          >
            {bio.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              maxWidth: 820,
              fontSize: 30,
              lineHeight: 1.4,
              color: "#6B7280",
            }}
          >
            Machine learning and perception research, robotics, and software
            engineering.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {areas.map((area) => (
            <div
              key={area}
              style={{
                display: "flex",
                border: "2px solid #1C1E21",
                color: "#1C1E21",
                backgroundColor: "#FFFFFF",
                borderRadius: 4,
                padding: "14px 22px",
                fontSize: 24,
                letterSpacing: 1,
              }}
            >
              {area}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
