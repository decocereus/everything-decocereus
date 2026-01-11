export const EXPERIENCE = {
  "04/25": {
    company: "Avail",
    website: "https://www.availproject.org/",
    from: "Apr 2025",
    to: "Current",
    designation: "Frontend Engineer",
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
  },
  "02/24": {
    company: "GAMP (previously Aura)",
    website: "https://gamp.gg/",
    from: "Feb 2024",
    to: "Apr 2025",
    designation: "Frontend Engineer II",
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
  },
  "08/23": {
    company: "Mojoboxx",
    website: "https://mojoboxx.com/",
    from: "Aug 2023",
    to: "Feb 2024",
    designation: "Full Stack Developer",
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
  },
  "07/2022": {
    company: "Amadeus",
    website: "https://amadeus.com/en",
    from: "July 2022",
    to: "May 2023",
    designation: "iOS Developer",
    location: "London, United Kingdom",
    tasks:
      "Developed UIKit-based features in Swift and Objective-C for Amadeus's white-label airline apps. Implemented MVVM patterns, feature flags, and networking optimizations to improve stability, maintainability, and app performance.",
    tech: ["Swift", "Objective-C", "UIKit", "MVVM", "REST APIs", "Xcode"],
  },
  "06/2021": {
    company: "CSRN",
    website: "https://csrn.org.uk/",
    from: "June 2021",
    to: "August 2021",
    designation: "Software Engineer Intern",
    location: "London, United Kingdom",
    tasks:
      "Conceptualized a project-management platform prototype to streamline coordination for upcoming initiatives across the organization.",
    tech: ["React", "MongoDB", "HTML/CSS", "JavaScript"],
  },
};

export const PROJECTS = {
  "001": {
    name: "Nexus SDK (Core)",
    link: "https://www.npmjs.com/package/@avail-project/nexus-core",
    image: "/nexus-sdk.png",
    description:
      "Core SDK powering Avail's Nexus, a meta-interoperability protocol connecting liquidity, assets, and logic across blockchains. Simplifies bridging, swapping, and chain switching for seamless cross-chain UX. Built modular React and TypeScript packages published via npm.",
    tech: ["TypeScript", "React", "Vite", "Node.js", "npm", "GitHub Actions"],
  },
  "002": {
    name: "Nexus SDK (Widgets)",
    link: "https://www.npmjs.com/package/@avail-project/nexus-widgets",
    image: "/nexus-sdk.png",
    description:
      "Prebuilt React widgets for Nexus SDK, enabling teams to integrate Nexus features instantly with pre-built UI components for rapid development.",
    tech: ["TypeScript", "React", "Vite", "Node.js", "npm", "GitHub Actions"],
  },
  "003": {
    name: "Nexus Elements",
    link: "https://elements.nexus.availproject.org/",
    image: "/nexus-elements.png",
    description:
      "Component library built on top of Nexus SDK using shadcn/ui. Enables teams to integrate Nexus features instantly with pre-built UI components, templates, and CLI-driven setup for rapid development.",
    tech: ["TypeScript", "React", "shadcn/ui", "Vite", "npm"],
  },
  "004": {
    name: "Git Receipts",
    link: "https://gitreceipts.vercel.app/",
    image: "/git-receipt.png",
    description:
      "Built a GitHub contribution generator that authenticates via NextAuth and renders a receipt-style contribution chart using fetched GraphQL data.",
    tech: ["Next.js", "TypeScript", "GraphQL", "OctoBot", "NextAuth"],
  },
  "005": {
    name: "Resume Builder",
    link: "https://easy-resumes.vercel.app/",
    image: "/resume-builder.png",
    description:
      "Generate a personal resume in one of several modern templates with instant PDF export.",
    tech: ["Next.js", "TypeScript", "PDF Generator"],
  },
  "006": {
    name: "Fitness Tracker",
    link: "https://gamp-fitness.vercel.app/",
    image: "/fitness.png",
    description:
      "Fitness tracker where users can start challenges and compete on a leaderboard using Postgres-backed server routes.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Server Routes"],
  },
  "007": {
    name: "Visited",
    link: "https://visited-client.vercel.app/",
    image: "/visited.png",
    description:
      "Web app + Chrome extension that track and display public URLs visited by a user. Shared Google Auth session between extension and web app.",
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

export const SKILLS = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Redux Toolkit",
  "TailwindCSS",
  "Openfort",
  "Web3",
  "Solidity",
  "Swift",
  "Objective-C",
  "UIKit",
  "Puppeteer",
  "GitHub Actions",
  "Docker",
  "GraphQL",
  "Jest",
  "Design Systems",
  "Performance Optimization",
];

export const SKILL_TREE = {
  frontend: {
    name: "Frontend",
    skills: [
      { name: "Next.js", level: "expert" },
      { name: "React", level: "expert" },
      { name: "TypeScript", level: "expert" },
      { name: "TailwindCSS", level: "expert" },
      { name: "Design Systems", level: "advanced" },
    ],
  },
  backend: {
    name: "Backend",
    skills: [
      { name: "Node.js", level: "advanced" },
      { name: "Express", level: "advanced" },
      { name: "REST APIs", level: "advanced" },
      { name: "PostgreSQL", level: "advanced" },
      { name: "Microservices", level: "advanced" },
      { name: "Docker", level: "intermediate" },
    ],
  },
  web3: {
    name: "web3 & B",
    skills: [
      { name: "Embedded Wallets (Openfort)", level: "advanced" },
      { name: "Session Keys & Gasless Flows", level: "advanced" },
      { name: "Solidity / Smart Contracts", level: "intermediate" },
      { name: "Cross-chain UX / Bridging patterns", level: "advanced" },
    ],
  },
  mobile: {
    name: "Mobile",
    skills: [
      { name: "Telegram Mini App", level: "intermediate" },
      { name: "SwiftUI", level: "intermediate" },
      { name: "React Native", level: "beginner" },
    ],
  },
};

export const SKILL_TREE_ELEMENTS = [
  {
    id: "1",
    isSelectable: true,
    name: "skills",
    children: [
      {
        id: "2",
        isSelectable: true,
        name: "frontend",
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
      },
      {
        id: "8",
        isSelectable: true,
        name: "backend",
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
      },
      {
        id: "15",
        isSelectable: true,
        name: "web3-blockchain",
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
      },
      {
        id: "20",
        isSelectable: true,
        name: "mobile",
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
      },
    ],
  },
];
