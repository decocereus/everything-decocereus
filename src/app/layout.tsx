import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { cn } from "@/lib/utils.ts";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

export const metadata: Metadata = {
  alternates: {
    canonical: "https://decocereus.com",
  },
  authors: [{ name: "Amartya Singh" }],
  creator: "Amartya Singh",
  description:
    "Amartya Singh builds products across backend systems, interfaces, and developer tools.",
  icons: {
    icon: [
      {
        href: "/logo.png",
        media: "(prefers-color-scheme: light)",
        url: "/logo.png",
      },
      {
        href: "/logo.png",
        media: "(prefers-color-scheme: dark)",
        url: "/logo.png",
      },
    ],
  },
  keywords: [
    "Product Engineer",
    "Next.js",
    "Node.js",
    "AI",
    "React",
    "TypeScript",
    "Portfolio",
  ],
  metadataBase: new URL("https://decocereus.com"),
  openGraph: {
    description:
      "Amartya Singh builds products across backend systems, interfaces, and developer tools.",
    images: [
      {
        alt: "Amartya Singh Portfolio",
        height: 630,
        url: "/logo.png",
        width: 1200,
      },
    ],
    locale: "en_US",
    siteName: "Amartya Singh Portfolio",
    title: "Amartya Singh",
    type: "website",
    url: "https://decocereus.com",
  },
  publisher: "Amartya Singh",
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
  title: "Amartya Singh",
  twitter: {
    card: "summary_large_image",
    description:
      "Amartya Singh builds products across backend systems, interfaces, and developer tools.",
    images: ["/logo.png"],
    title: "Amartya Singh",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="scroll-smooth" lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        {children}
      </body>
    </html>
  );
}
