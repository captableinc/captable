import { ImageResponse } from "next/og";
import { OpenCapLogo } from "@/components/shared/logo";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "About OpenCap";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  // Font
  const calSans = fetch(
    new URL("../assets/fonts/CalSans.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <OpenCapLogo className="h-20 w-20" />
        <div style={{ fontSize: "6rem", marginBottom: "1.5rem" }}>OpenCap</div>
        <div style={{ fontSize: "2.5rem" }}>Your shares. Now private.</div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: "Inter",
          data: await calSans,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
