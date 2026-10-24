import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { SITE } from "@/lib/site.ts";
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
    canonical: "/",
  },
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  category: "technology",
  creator: SITE.name,
  description: SITE.description,
  icons: {
    apple: [
      {
        sizes: "180x180",
        type: "image/png",
        url: "/apple-touch-icon.png",
      },
    ],
    icon: [
      {
        sizes: "any",
        type: "image/x-icon",
        url: "/favicon.ico",
      },
      {
        sizes: "any",
        type: "image/svg+xml",
        url: "/logo.svg",
      },
    ],
    shortcut: "/favicon.ico",
  },
  metadataBase: new URL(SITE.url),
  openGraph: {
    description: SITE.description,
    images: [
      {
        alt: "Amartya Singh's sketchbook with a cat, game controller, football, devices, headphones, and guitar.",
        height: 630,
        url: "/opengraph-image.png",
        width: 1200,
      },
    ],
    locale: "en_US",
    siteName: SITE.name,
    title: SITE.title,
    type: "website",
    url: "/",
  },
  publisher: SITE.name,
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
  title: SITE.title,
  twitter: {
    card: "summary_large_image",
    creator: "@decocereus",
    description: SITE.description,
    images: [
      {
        alt: "Amartya Singh's sketchbook with a cat, game controller, football, devices, headphones, and guitar.",
        height: 630,
        url: "/twitter-image.png",
        width: 1200,
      },
    ],
    title: SITE.title,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
