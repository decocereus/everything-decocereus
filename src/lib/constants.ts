export const PORTFOLIO_BIO = [
  {
    id: "what-i-enjoy",
    segments: [
      {
        text: "I am an engineer who enjoys building different products because the people, constraints and problems are rarely the same. So far, that has taken me from a gaming social app and airport operations to cross-chain transactions, private trading, writing tools, and small utilities I wanted for myself.",
      },
    ],
  },
  {
    id: "what-i-am-building",
    segments: [
      { text: "At " },
      {
        href: "https://www.availproject.org/",
        preview: "avail",
        text: "Avail",
      },
      {
        text: ", that currently means working on Nightshade and ",
      },
      {
        href: "https://widgets.availproject.org/",
        preview: "nexus",
        text: "Nexus",
      },
      {
        text: ". Nightshade is the privacy layer behind ",
      },
      {
        href: "https://www.shieldtx.xyz/",
        preview: "shieldtx",
        text: "ShieldTX",
      },
      {
        text: ". I own the backend service that keeps each private trade moving, from a request in the app to the completed trade. On Nexus, I helped take the product from its first SDK to installable components for bridging, swapping, and moving assets across chains, just to name a few.",
      },
    ],
  },
  {
    id: "outside-work",
    segments: [
      {
        text: "Away from work, my attention rotates between my ",
      },
      {
        interest: "cat",
        text: "cat",
      },
      {
        text: ", video games, playing my guitar, and whatever ",
      },
      {
        href: "https://www.realmadrid.com/en-US",
        preview: "real-madrid",
        text: "Real Madrid",
      },
      {
        text: " are doing that week. ",
      },
      {
        interest: "music",
        text: "Music",
      },
      {
        text: " and ",
      },
      {
        interest: "anime",
        text: "anime",
      },
      {
        text: " fill most of the gaps; gadgets fill most of the desk.",
      },
    ],
  },
] as const;

export const PORTFOLIO_MUSIC = [
  {
    artist: "Doja Cat",
    durationSeconds: 195,
    href: "https://music.youtube.com/watch?v=v0SJwiFPqF0",
    title: "AAAHH MEN!",
    videoId: "w6VZ4qm-e0w",
  },
  {
    artist: "Shashwat Sachdev",
    durationSeconds: 226,
    href: "https://music.youtube.com/watch?v=qoVARB96kuM",
    title: 'Destiny - Mann Atkeya (From "Dhurandhar The Revenge")',
    videoId: "C0Uvo4lm_aw",
  },
  {
    artist: "Shashwat Sachdev",
    durationSeconds: 163,
    href: "https://music.youtube.com/watch?v=f0i95p5l67Y",
    title: "Dhurandhar The Revenge - Aari Aari",
    videoId: "dESIGVxSSCE",
  },
  {
    artist: "Raftaar",
    durationSeconds: 219,
    href: "https://music.youtube.com/watch?v=Vq68hYSvMiw",
    title: "TRAP PRAA",
    videoId: "QqyuVF1u7_Y",
  },
  {
    artist: "IKKA",
    durationSeconds: 329,
    href: "https://music.youtube.com/watch?v=ig0IqOuWD90",
    title: "WOH",
    videoId: "EbyAoYaUcVo",
  },
  {
    artist: "Rawme Hooda",
    durationSeconds: 245,
    href: "https://music.youtube.com/watch?v=KmzXCSyfQQo",
    title: "Total",
    videoId: "jwl2BsZ_g08",
  },
  {
    artist: "Prabh Singh",
    durationSeconds: 123,
    href: "https://music.youtube.com/watch?v=-BzQVu8EuQ4",
    title: "9:45",
    videoId: "bzSn6AKLkMI",
  },
  {
    artist: "Afusic",
    durationSeconds: 208,
    href: "https://music.youtube.com/watch?v=rOCe2i7fOCQ",
    title: "Pal Pal (with Talwiinder)",
    videoId: "AbkEmIgJMcU",
  },
  {
    artist: "Honey Singh",
    durationSeconds: 232,
    href: "https://music.youtube.com/watch?v=Rz-7uqy8bFs",
    title: "Payal",
    videoId: "a-PAcmi5Kas",
  },
] as const;

export const PORTFOLIO_ANIME = [
  {
    href: "https://www.crunchyroll.com/series/GRMG8ZQZR/one-piece",
    imageAlt: "One Piece official series artwork.",
    imageSrc: "https://one-piece.com/img/ogpimage.jpg",
    theme: "one-piece",
    title: "One Piece",
  },
  {
    href: "https://www.crunchyroll.com/series/GY8VM8MWY/haikyu",
    imageAlt: "The Haikyu official series mark.",
    imageSrc: "https://haikyu.jp/favicon.ico",
    theme: "haikyu",
    title: "Haikyu!!",
  },
  {
    href: "https://www.crunchyroll.com/series/GY9PJ5KWR/naruto",
    imageAlt: "Naruto official series artwork.",
    imageSrc: "https://naruto-official.com/common/ogp/NTOS_OG-main.png",
    theme: "naruto",
    title: "Naruto",
  },
  {
    href: "https://www.crunchyroll.com/series/GR751KNZY/attack-on-titan",
    imageAlt: "Attack on Titan official key visual.",
    imageSrc:
      "https://aot-portal.com/wp/wp-content/uploads/2026/05/FS_KV2_2-1368x1935.jpg",
    theme: "attack-on-titan",
    title: "Attack on Titan",
  },
  {
    href: "https://www.crunchyroll.com/series/GT00378116/smoking-behind-the-supermarket-with-you",
    imageAlt: "Smoking Behind the Supermarket with You official artwork.",
    imageSrc: "https://yanisuu.com/assets/img/ogp.jpg?ver=1.37",
    theme: "smoking",
    title: "Smoking Behind the Supermarket with You",
  },
] as const;

export const PORTFOLIO_LINK_PREVIEWS = {
  avail: {
    accent: "oklch(0.67 0.22 255)",
    domain: "availproject.org",
    imageAlt: "Avail website preview.",
    imageSrc: "https://www.availproject.org/assets/og/og-image.jpg",
    title: "Avail",
  },
  nexus: {
    accent: "oklch(0.67 0.22 255)",
    domain: "widgets.availproject.org",
    imageAlt: "Nexus by Avail website preview.",
    imageSrc: "https://widgets.availproject.org/1200x630.png",
    title: "Nexus",
  },
  "real-madrid": {
    accent: "oklch(0.68 0.23 260)",
    domain: "realmadrid.com",
    imageAlt: "Real Madrid official website preview.",
    imageSrc:
      "https://publish.realmadrid.com/content/dam/common/statics/public-content/internet/web/rm-spa-web/images/meta/og-image.png",
    title: "Real Madrid",
  },
  shieldtx: {
    accent: "oklch(0.8 0.16 205)",
    domain: "shieldtx.xyz",
    imageAlt: "ShieldTX website preview.",
    imageSrc: "https://www.shieldtx.xyz/assets/og-image.jpg",
    title: "ShieldTX",
  },
} as const;

export const PORTFOLIO_LORE = {
  label: "Code plus secure, rearranged as decocereus",
  story:
    "Python was the first language I learned. One of the first programs I wrote was an anagram generator. It combined code + secure and produced decocereus. I thought that was cool, and it has been my username ever since.",
  title: "Lore",
} as const;

export const PORTFOLIO_CAT = {
  alt: "An orange cat asleep on a cat tree.",
  src: "/images/cat.jpg",
} as const;

export const PORTFOLIO_GITHUB = {
  href: "https://github.com/decocereus",
  login: "decocereus",
} as const;

export const PORTFOLIO_WORK = [
  {
    href: "https://www.usevolt.app/",
    name: "Volt",
    scope: "Product, design, engineering",
    storeHref:
      "https://chromewebstore.google.com/detail/volt/mccjgabeopbafjehgbhmjoipddgakafl",
    summary:
      "An AI ghostwriter for X that learned how you write. I designed, built, and launched the whole product.",
  },
  {
    href: "https://www.shieldtx.xyz/",
    name: "ShieldTX",
    scope: "Backend systems",
    summary:
      "Privacy-preserving perpetuals trading on Hyperliquid. I own the backend that coordinates trading workflows, live market connections, third-party services, and the frontend API.",
  },
  {
    href: "https://widgets.availproject.org/",
    name: "Nexus",
    scope: "SDK and UI",
    summary:
      "Brings balances held across chains together. I built the first SDK and later the installable UI for bridge, swap, and transaction flows.",
  },
  {
    href: "https://xtract.decocereus.com/",
    name: "xtract",
    scope: "Open source",
    sourceHref: "https://github.com/decocereus/xtract",
    summary:
      "An open-source tool that turns public X posts and articles into clean Markdown, text, or JSON for people and agents.",
  },
  {
    href: "https://github.com/decocereus/dex-notch",
    name: "dex-notch",
    scope: "macOS app",
    sourceHref: "https://github.com/decocereus/dex-notch",
    summary:
      "A native macOS companion for T3 Code that shows agent activity and context usage around the notch. It is still in active development.",
  },
] as const;

export const PORTFOLIO_CODEX = {
  description:
    "I use Codex every day and hand most of the heavy lifting to subagents. Here’s the running tally.",
  title: "Working with agents",
} as const;

export const PORTFOLIO_CONTACT = {
  cta: {
    body: "Got something worth talking about? DM me on X or send an email.",
    button: "Get in touch",
    emailLabel: "Send me an email",
    title: "Let's talk",
    xLabel: "DM me on X",
  },
  links: [
    { href: "https://github.com/decocereus", label: "GitHub" },
    { href: "https://x.com/decocereus", label: "X" },
    {
      href: "https://www.linkedin.com/in/amartyasingh07/",
      label: "LinkedIn",
    },
  ],
  mailHref: "mailto:amartyasinghkings07@gmail.com",
  resumeHref: "/resume",
} as const;
