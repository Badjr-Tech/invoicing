import { ImageResponse } from "next/og";

/**
 * PNG favicon, generated from the mark.
 *
 * Exists alongside icon.svg because Safari ignores SVG favicons entirely —
 * with only the SVG, Safari tabs showed a blank page icon.
 */
export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FBF8F3", // clay-50; transparent renders black in some tab UIs
          borderRadius: 12,
        }}
      >
        <svg width="56" height="56" viewBox="0 0 500 500">
          <polygon points="250,40 424,338 76,338" fill="#C87A17" />
          <polygon points="250,104 326,236 174,236" fill="#A3C293" />
          <circle cx="250" cy="196" r="162" fill="none" stroke="#A3C293" strokeWidth="17" />
        </svg>
      </div>
    ),
    size,
  );
}
