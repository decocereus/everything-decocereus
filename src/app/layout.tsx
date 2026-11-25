import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Draw", description: "Private whiteboard" };
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const originTrial = process.env.WEBMCP_ORIGIN_TRIAL_TOKEN;
  return (
    <html lang="en">
      <head>
        {originTrial ? <meta httpEquiv="origin-trial" content={originTrial} /> : null}
        {/* Excalidraw loads its fonts from here instead of a CDN. */}
        <script dangerouslySetInnerHTML={{ __html: 'window.EXCALIDRAW_ASSET_PATH="/";' }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
