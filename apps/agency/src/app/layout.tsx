import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import { HERO } from "@/lib/content.ts";
import { getAuditPrice, withPrice } from "@/lib/price.ts";
import { SITE } from "@/lib/site.ts";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const TITLE = `${SITE.title} | ${SITE.name}`;

export async function generateMetadata(): Promise<Metadata> {
  const { now } = await getAuditPrice();
  const description = withPrice(SITE.description, now);
  return {
    alternates: { canonical: "/" },
    description,
    metadataBase: new URL(SITE.url),
    openGraph: {
      description,
      siteName: SITE.name,
      title: HERO.headline,
      type: "website",
      url: SITE.url,
    },
    title: TITLE,
    twitter: {
      card: "summary_large_image",
      creator: SITE.x.handle,
      description,
      site: SITE.x.handle,
      title: HERO.headline,
    },
    // Set in Vercel once Search Console gives you the tag. Bing imports the site from Search Console.
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  };
}

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
