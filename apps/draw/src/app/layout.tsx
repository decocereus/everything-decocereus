import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  description: "Private whiteboard",
  title: "Draw",
};
export const viewport: Viewport = { initialScale: 1, width: "device-width" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const originTrial = process.env.WEBMCP_ORIGIN_TRIAL_TOKEN;
  return (
    <html lang="en">
      <head>
        {originTrial ? (
          <meta content={originTrial} httpEquiv="origin-trial" />
        ) : null}
        {/* Excalidraw loads its fonts from here instead of a CDN. */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: a fixed inline script, no user input; it must run before Excalidraw loads
          dangerouslySetInnerHTML={{
            __html: 'window.EXCALIDRAW_ASSET_PATH="/";',
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
