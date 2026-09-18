import { ImageResponse } from "next/og";

/** 180×180 apple-touch-icon — home screen bookmarks on iOS. */
export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#2F4124", // sage-800; iOS squares icons, dark reads best
        }}
      >
        <svg width="132" height="132" viewBox="0 0 500 500">
          <polygon points="250,40 424,338 76,338" fill="#E5A54F" />
          <polygon points="250,104 326,236 174,236" fill="#F2F6EF" />
          <circle cx="250" cy="196" r="162" fill="none" stroke="#F2F6EF" strokeWidth="17" />
        </svg>
      </div>
    ),
    size,
  );
}
