import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import { HERO } from "@/lib/content.ts";
import { SITE } from "@/lib/site.ts";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const TITLE = `${SITE.title} | ${SITE.name}`;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    description: SITE.description,
    siteName: SITE.name,
    title: HERO.headline,
    type: "website",
    url: SITE.url,
  },
  title: TITLE,
  twitter: {
    card: "summary_large_image",
    creator: SITE.x.handle,
    description: SITE.description,
    site: SITE.x.handle,
    title: HERO.headline,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${geist.variable} ${geistMono.variable}`} lang="en">
      <body className="min-h-screen bg-paper font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
