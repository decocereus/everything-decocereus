/** The brand name is temporary. Change `name` here and every page, title and share image follows. */
export const SITE = {
  bookingUrl: "https://cal.com/decocereus/intro",
  /** Under 155 characters with the price filled in, so search results show all of it. `{price}` comes from `getAuditPrice()`. */
  description:
    "A {price} fixed-price AI audit of how your work runs, tested on your own examples. Fee back if it finds nothing worth more. Then I build it.",
  email: "amartya@decocereus.com",
  name: "decocereus agents",
  /** The line along the bottom of the share card, so a link preview says what this is. */
  ogTagline: "Fixed-price AI audit",
  title: "Fixed-price AI audit and automation builds",
  url: "https://agents.decocereus.com",
  x: { handle: "@decocereus", url: "https://x.com/decocereus" },
} as const;
