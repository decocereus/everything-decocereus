export const PORTFOLIO_BIO = [
  {
    id: "what-i-enjoy",
    segments: [
      {
        text: "I'm an engineer who likes taking a product from an idea to something people can use. My work spans backend systems, interfaces, and tools I've built for myself.",
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
        text: ", I own the backend service behind ",
      },
      {
        href: "https://www.shieldtx.xyz/",
        preview: "shieldtx",
        text: "ShieldTX",
      },
      {
        text: ", coordinating private trades from a request in the app through to completion. I also built the initial SDK and installable UI for ",
      },
      {
        href: "https://widgets.availproject.org/",
        preview: "nexus",
        text: "Nexus",
      },
      {
        text: ", which helps applications move assets across chains.",
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
    href: "https://usevolt.app",
    name: "Volt",
    scope: "Product, design, engineering · Archived",
    storeHref:
      "https://chromewebstore.google.com/detail/volt/mccjgabeopbafjehgbhmjoipddgakafl",
    storeLabel: "Chrome Web Store listing",
    summary:
      "An AI writing tool I built to draft X posts in my own voice, then launched as a product. I owned the design and engineering, including the web app and browser extension. The product is retired and its backend is offline.",
  },
  {
    caseStudy: {
      href: "https://www.shieldtx.xyz/",
      label: "Read the ShieldTX case study",
      linkLabel: "Explore ShieldTX",
      sections: [
        {
          body: "A private trade depends on several services agreeing on what has happened. Keeping that coordination in the frontend made the app responsible for too much, especially when a request was interrupted or an external service responded late.",
          title: "The problem",
        },
        {
          body: "I proposed moving third-party coordination behind a dedicated backend boundary, designed the layer, and built its first implementation. That gave the frontend one API for trading workflows while the backend coordinated the work between services.",
          title: "The decision",
        },
        {
          body: "I lead the backend work and build it with the team. My ongoing work covers trading workflows, live market connections, recovery, and tools that help us understand interrupted operations. Testing and user feedback feed back into how those workflows behave.",
          title: "What I own today",
        },
      ],
    },
    href: "https://www.shieldtx.xyz/",
    name: "ShieldTX",
    scope: "Backend systems",
    summary:
      "Private trading on Hyperliquid. My work focuses on coordinating services and recovering interrupted trades, with tools to understand what happened and what needs attention.",
  },
  {
    caseStudy: {
      href: "https://widgets.availproject.org/",
      label: "Read the Nexus case study",
      linkLabel: "Explore Nexus Elements",
      sections: [
        {
          body: "Applications needed to bring balances across chains into one flow. I built the initial SDK and UI, but packaging them together limited how teams could customize the interface and added unnecessary package weight.",
          title: "The problem",
        },
        {
          body: "I separated the headless SDK from the UI and rebuilt the interface as shadcn components installed through a registry. The SDK handled the transaction logic; integration teams could edit the UI source in their own projects.",
          title: "The decision",
        },
        {
          body: "I built and maintained the Elements distribution site and registry integration, with bridge, swap, and swap-and-execute flows. Teams could use the SDK with their own interface or start with the installable components and adapt them.",
          title: "What shipped",
        },
      ],
    },
    href: "https://widgets.availproject.org/",
    name: "Nexus",
    scope: "SDK and UI",
    summary:
      "Brings balances held across chains together. I separated the UI from the SDK so integration teams could install, own, and customize the components in their own codebases.",
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
    "AI is part of how I build. I use agents to explore ideas, write code, and review changes so I can move quickly from idea to working software.",
  title: "Working with agents",
} as const;

export const PORTFOLIO_CONTACT = {
  cta: {
    body: "Have a role or project in mind? Email me or DM me on X.",
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
