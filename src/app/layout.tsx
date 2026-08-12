import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { cn } from "@/lib/utils.ts";
import "./globals.css";
import Link from "next/link";
import { RESUME_URL } from "@/lib/constants.ts";

const inter = Inter({
  subsets: ["latin"],
});

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: "device-width",
};

export const metadata: Metadata = {
  alternates: {
    canonical: "https://decocereus.com",
  },
  authors: [{ name: "Amartya Singh" }],
  creator: "Amartya Singh",
  description:
    "Personal Portfolio of Amartya Singh - Full Stack Engineer proficient in Next.js, Node.js and Web3",
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
    "Full Stack Engineer",
    "Next.js",
    "Node.js",
    "Web3",
    "React",
    "TypeScript",
    "Portfolio",
  ],
  metadataBase: new URL("https://decocereus.com"),
  openGraph: {
    description:
      "Personal Portfolio of Amartya Singh - Full Stack Engineer proficient in Next.js, Node.js and Web3",
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
    title: "Amartya Singh | Full Stack Engineer",
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
  title: "Amartya Singh | Full Stack Engineer",
  twitter: {
    card: "summary_large_image",
    description:
      "Personal Portfolio of Amartya Singh - Full Stack Engineer proficient in Next.js, Node.js and Web3",
    images: ["/logo.png"],
    title: "Amartya Singh | Full Stack Engineer",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark scroll-smooth" lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <header className="updated sticky top-0 z-50 w-full bg-background/80 px-6 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-3xl items-center justify-between">
            <p className="select-none py-2 font-medium text-foreground">AS</p>
            <Link
              className="rounded-lg px-4 py-2 text-foreground text-sm transition-colors duration-200 hover:bg-accent"
              href={RESUME_URL}
              rel="noreferrer"
              target="_blank"
            >
              View Resume
            </Link>
          </div>
        </header>
        {children}
        <footer className="updated w-full border-border border-t py-8">
          <div className="mx-auto flex max-w-3xl items-center justify-center px-4">
            <p className="text-center text-muted-foreground text-xs">
              © {new Date().getFullYear()} Amartya Singh
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
