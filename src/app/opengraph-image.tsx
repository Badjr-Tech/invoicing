import { ImageResponse } from "next/og";

/**
 * The 1200×630 card shown when a link to AGENCY is shared.
 *
 * Rendered at the edge from the design tokens, so it never drifts from the
 * brand the way a static export eventually would.
 */
export const runtime = "edge";
export const alt = "AGENCY — one place for the whole business";
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
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#2F4124", // sage-800
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="72" height="72" viewBox="0 0 500 500">
            <polygon points="250,40 424,338 76,338" fill="#E5A54F" />
            <polygon points="250,104 326,236 174,236" fill="#F2F6EF" />
            <circle cx="250" cy="196" r="162" fill="none" stroke="#F2F6EF" strokeWidth="17" />
          </svg>
          <div style={{ display: "flex", fontSize: 44, letterSpacing: 6, color: "#F2F6EF" }}>
            AGENCY
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, lineHeight: 1.1, color: "#FFFFFF" }}>
            One place for the whole business.
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 34, color: "#C9DBC0" }}>
            Invoice, get paid, keep your books, learn to grow.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#A3C293" }}>
            No monthly fee. We earn when you earn.
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#E5A54F" }}>
            DakJen Creative LLC
          </div>
        </div>
      </div>
    ),
    size,
  );
}
