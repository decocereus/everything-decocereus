export const SOCIALS = [
  { href: "https://github.com/decocereus", label: "GitHub" },
  { href: "https://x.com/decocereus", label: "X" },
  {
    href: "https://www.linkedin.com/in/amartyasingh07/",
    label: "LinkedIn",
  },
  { href: "mailto:amartyasinghkings07@gmail.com", label: "Email" },
] as const;

export const EXPERIENCE = [
  {
    company: "Avail",
    dates: "Apr 2025 → Now",
    role: "Product Engineer",
  },
  {
    company: "GAMP",
    dates: "Feb 2024 → Apr 2025",
    role: "Frontend Engineer II",
  },
  {
    company: "Mojoboxx",
    dates: "Aug 2023 → Feb 2024",
    role: "Full Stack Developer",
  },
  {
    company: "Amadeus",
    dates: "Jul 2022 → May 2023",
    role: "Software Engineering Graduate, iOS",
  },
  {
    company: "CSRN",
    dates: "Jun 2021 → Aug 2021",
    role: "Software Engineer Intern",
  },
] as const;

export const FEATURED_WORK = [
  {
    detail:
      "I own the backend that coordinates trading workflows, live market connections, third-party services, and the frontend API.",
    id: "shieldtx",
    name: "ShieldTX",
    summary: "A privacy-preserving trading platform built on Hyperliquid.",
  },
  {
    detail:
      "I built its first SDK and later the UI components for bridge, swap, and transaction flows, distributed through the shadcn registry.",
    href: "https://widgets.availproject.org/",
    id: "nexus",
    name: "Nexus",
    summary: "Nexus brings balances held across different chains together.",
  },
  {
    detail:
      "It could also generate ideas, long-form articles, profile feedback, and images. I designed, built, and launched the whole product end to end. It is now archived.",
    href: "https://www.usevolt.app/",
    id: "volt",
    name: "Volt",
    summary:
      "An AI ghostwriter for X that learns how you write and drafts posts in your voice.",
  },
] as const;

export const SMALL_PROJECTS = [
  {
    description: "Turns a GitHub contribution graph into a receipt.",
    href: "https://gitreceipts.vercel.app/",
    name: "Git Receipts",
    sourceHref: "https://github.com/decocereus/git-receipts",
  },
] as const;
