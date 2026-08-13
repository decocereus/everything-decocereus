export const PORTFOLIO_SOCIALS = [
  { href: "https://github.com/decocereus", label: "GitHub" },
  { href: "https://x.com/decocereus", label: "X" },
  {
    href: "https://www.linkedin.com/in/amartyasingh07/",
    label: "LinkedIn",
  },
  { href: "mailto:amartyasinghkings07@gmail.com", label: "Email" },
] as const;

export const PORTFOLIO_CURRENT_WORK = {
  company: "Avail",
  dates: "Apr 2025 → Now",
  projects: [
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
  ],
  role: "Product Engineer",
} as const;

export const PORTFOLIO_PLACES = [
  {
    company: "GAMP",
    dates: "Feb 2024 → Apr 2025",
    role: "Frontend Engineer II",
    summary:
      "I helped build the gaming platform from its first version through tournaments, rewards, profiles, social features, and embedded wallets.",
  },
  {
    company: "Mojoboxx",
    dates: "Aug 2023 → Feb 2024",
    role: "Full Stack Developer",
    summary:
      "I worked across a hotel-booking product, including search, booking, payments, maps, and partner integrations.",
  },
  {
    company: "Amadeus",
    dates: "Jul 2022 → May 2023",
    role: "Software Engineering Graduate, iOS",
    summary:
      "I worked on iOS software used by airport teams for check-ins, baggage, flight schedules, and day-to-day operations.",
  },
  {
    company: "CSRN",
    dates: "Jun 2021 → Aug 2021",
    role: "Software Engineer Intern",
    summary:
      "I prototyped a project-management tool for coordinating the organisation’s upcoming work.",
  },
] as const;

export const PORTFOLIO_SIDE_PROJECTS = {
  highlight: {
    detail:
      "It could also generate ideas, long-form articles, profile feedback, and images. I designed, built, and launched the whole product end to end. It is now archived.",
    href: "https://www.usevolt.app/",
    name: "Volt",
    summary:
      "An AI ghostwriter for X that learns how you write and drafts posts in your voice.",
  },
  smaller: [
    {
      description: "Turns a GitHub contribution graph into a receipt.",
      href: "https://gitreceipts.vercel.app/",
      name: "Git Receipts",
      sourceHref: "https://github.com/decocereus/git-receipts",
    },
  ],
} as const;
