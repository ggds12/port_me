import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1a1a18",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontFamily: "ui-monospace, monospace",
            fontWeight: 400,
            fontSize: 15,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#faf9f5" }}>gg</span>
          <span style={{ color: "#d4a574" }}>.</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
