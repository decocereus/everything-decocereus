export const SITE = {
  bookingUrl: null as string | null,
  description:
    "We put AI agents to work on the busywork in your business, and show you the hours you get back.",
  name: "Agency",
  url: "https://agents.decocereus.com",
  x: { handle: "@decocereus", url: "https://x.com/decocereus" },
} as const;

export const CONTACT = SITE.bookingUrl
  ? { href: SITE.bookingUrl, label: "Book a call" }
  : { href: "#book", label: "Get in touch" };
