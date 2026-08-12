export const EXPERIENCE = {
  "02/24": {
    company: "GAMP (previously Aura)",
    designation: "Frontend Engineer II",
    from: "Feb 2024",
    location: "Remote",
    tasks:
      "Led the frontend through GAMP's pivot from Web3 to social gaming. Built major features like Rewards, Events, and Buddies; integrated embedded wallets (Openfort) and Riot authentication; optimized SEO and performance with SSR. Scaled the platform to over 100K users with 10K smart wallets.",
    tech: [
      "Next.js",
      "TypeScript",
      "React",
      "Openfort",
      "Puppeteer",
      "PostgreSQL",
      "Microservices",
    ],
    to: "Apr 2025",
    website: "https://gamp.gg/",
  },
  "04/25": {
    company: "Avail",
    designation: "Frontend Engineer",
    from: "Apr 2025",
    location: "Remote",
    tasks:
      "Building the Nexus SDK, Avail's meta-interoperability protocol that connects liquidity, assets, and coordination logic across blockchains. Nexus eliminates manual bridging, swapping, and chain switching to create a seamless 'bridgeless' user experience. Designed and shipped the Nexus Elements component library, integrated cross-chain transaction flows (Bridge, Send, BridgeAndExecute), and automated the SDK release pipeline.",
    tech: [
      "TypeScript",
      "React",
      "Nexus SDK",
      "shadcn/ui",
      "Node.js",
      "Vite",
      "GitHub Actions",
    ],
    to: "Current",
    website: "https://www.availproject.org/",
  },
  "06/2021": {
    company: "CSRN",
    designation: "Software Engineer Intern",
    from: "June 2021",
    location: "London, United Kingdom",
    tasks:
      "Conceptualized a project-management platform prototype to streamline coordination for upcoming initiatives across the organization.",
    tech: ["React", "MongoDB", "HTML/CSS", "JavaScript"],
    to: "August 2021",
    website: "https://csrn.org.uk/",
  },
  "07/2022": {
    company: "Amadeus",
    designation: "iOS Developer",
    from: "July 2022",
    location: "London, United Kingdom",
    tasks:
      "Developed UIKit-based features in Swift and Objective-C for Amadeus's white-label airline apps. Implemented MVVM patterns, feature flags, and networking optimizations to improve stability, maintainability, and app performance.",
    tech: ["Swift", "Objective-C", "UIKit", "MVVM", "REST APIs", "Xcode"],
    to: "May 2023",
    website: "https://amadeus.com/en",
  },
  "08/23": {
    company: "Mojoboxx",
    designation: "Full Stack Developer",
    from: "Aug 2023",
    location: "Gurugram, India",
    tasks:
      "Built an online hotel booking platform in partnership with Cleartrip. Implemented booking and payment flows, integrated Google Maps, Paytm, and Cleartrip APIs, and optimized the UX with responsive, mobile-first design.",
    tech: [
      "React",
      "Node.js",
      "Express",
      "SQL",
      "Redux Toolkit",
      "REST APIs",
      "AWS",
    ],
    to: "Feb 2024",
    website: "https://mojoboxx.com/",
  },
};

export const PROJECTS = {
  "001": {
    description:
      "Core SDK powering Avail's Nexus, a meta-interoperability protocol connecting liquidity, assets, and logic across blockchains. Simplifies bridging, swapping, and chain switching for seamless cross-chain UX. Built modular React and TypeScript packages published via npm.",
    image: "/nexus-sdk.png",
    link: "https://www.npmjs.com/package/@avail-project/nexus-core",
    name: "Nexus SDK (Core)",
    tech: ["TypeScript", "React", "Vite", "Node.js", "npm", "GitHub Actions"],
  },
  "002": {
    description:
      "Prebuilt React widgets for Nexus SDK, enabling teams to integrate Nexus features instantly with pre-built UI components for rapid development.",
    image: "/nexus-sdk.png",
    link: "https://www.npmjs.com/package/@avail-project/nexus-widgets",
    name: "Nexus SDK (Widgets)",
    tech: ["TypeScript", "React", "Vite", "Node.js", "npm", "GitHub Actions"],
  },
  "003": {
    description:
      "Component library built on top of Nexus SDK using shadcn/ui. Enables teams to integrate Nexus features instantly with pre-built UI components, templates, and CLI-driven setup for rapid development.",
    image: "/nexus-elements.png",
    link: "https://elements.nexus.availproject.org/",
    name: "Nexus Elements",
    tech: ["TypeScript", "React", "shadcn/ui", "Vite", "npm"],
  },
  "004": {
    description:
      "Built a GitHub contribution generator that authenticates via NextAuth and renders a receipt-style contribution chart using fetched GraphQL data.",
    image: "/git-receipt.png",
    link: "https://gitreceipts.vercel.app/",
    name: "Git Receipts",
    tech: ["Next.js", "TypeScript", "GraphQL", "OctoBot", "NextAuth"],
  },
  "005": {
    description:
      "Generate a personal resume in one of several modern templates with instant PDF export.",
    image: "/resume-builder.png",
    link: "https://easy-resumes.vercel.app/",
    name: "Resume Builder",
    tech: ["Next.js", "TypeScript", "PDF Generator"],
  },
  "006": {
    description:
      "Fitness tracker where users can start challenges and compete on a leaderboard using Postgres-backed server routes.",
    image: "/fitness.png",
    link: "https://gamp-fitness.vercel.app/",
    name: "Fitness Tracker",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Server Routes"],
  },
  "007": {
    description:
      "Web app + Chrome extension that track and display public URLs visited by a user. Shared Google Auth session between extension and web app.",
    image: "/visited.png",
    link: "https://visited-client.vercel.app/",
    name: "Visited",
    tech: ["Next.js", "TypeScript", "Node.js", "Vercel Postgres"],
  },
};

export const SOCIALS = [
  { name: "LinkedIn", url: "https://www.linkedin.com/in/amartyasingh07/" },
  { name: "X", url: "https://x.com/decocereus" },
  { name: "GitHub", url: "https://github.com/decocereus" },
];

export const RESUME_URL =
  "https://drive.google.com/file/d/1UCsDV7VvqCfvJu-aGFHmSJf7J3LT0lao/view?usp=sharing";

export const SKILL_TREE_ELEMENTS = [
  {
    children: [
      {
        children: [
          {
            id: "3",
            isSelectable: true,
            name: "next.js",
          },
          {
            id: "4",
            isSelectable: true,
            name: "react",
          },
          {
            id: "5",
            isSelectable: true,
            name: "typescript",
          },
          {
            id: "6",
            isSelectable: true,
            name: "tailwindcss",
          },
          {
            id: "7",
            isSelectable: true,
            name: "design-systems",
          },
        ],
        id: "2",
        isSelectable: true,
        name: "frontend",
      },
      {
        children: [
          {
            id: "9",
            isSelectable: true,
            name: "node.js",
          },
          {
            id: "10",
            isSelectable: true,
            name: "express",
          },
          {
            id: "11",
            isSelectable: true,
            name: "rest-apis",
          },
          {
            id: "12",
            isSelectable: true,
            name: "postgresql",
          },
          {
            id: "13",
            isSelectable: true,
            name: "microservices",
          },
          {
            id: "14",
            isSelectable: true,
            name: "docker",
          },
        ],
        id: "8",
        isSelectable: true,
        name: "backend",
      },
      {
        children: [
          {
            id: "16",
            isSelectable: true,
            name: "embedded-wallets(openfort)",
          },
          {
            id: "17",
            isSelectable: true,
            name: "session-keys-gasless-flows",
          },
          {
            id: "18",
            isSelectable: true,
            name: "solidity-smart-contracts",
          },
          {
            id: "19",
            isSelectable: true,
            name: "cross-chain-ux-bridging-patterns",
          },
        ],
        id: "15",
        isSelectable: true,
        name: "web3-blockchain",
      },
      {
        children: [
          {
            id: "21",
            isSelectable: true,
            name: "telegram-mini-app",
          },
          {
            id: "22",
            isSelectable: true,
            name: "swiftui",
          },
          {
            id: "23",
            isSelectable: true,
            name: "react-native",
          },
        ],
        id: "20",
        isSelectable: true,
        name: "mobile",
      },
    ],
    id: "1",
    isSelectable: true,
    name: "skills",
  },
];
