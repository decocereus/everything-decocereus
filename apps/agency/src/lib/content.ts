export const NAV = [
  { href: "#who", label: "Who it's for" },
  { href: "#offer", label: "Offer" },
  { href: "#process", label: "Process" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
] as const;

export const CTA = "Book a 15-minute call";

export const HERO = {
  /** The manual work the hero and the share image strike through. */
  chores: [
    "Qualifying leads",
    "Drafting proposals",
    "Chasing invoices",
    "Updating the CRM",
    "Support triage",
    "Reconciling spreadsheets",
  ],
  choresLabel: "Off your plate",
  headline: "Get your time back.",
  lead: "I work with one team at a time on one question: which work eats your week, and what would it take to hand it to AI? You leave with a working system, not a deck.",
  promise:
    "Fixed-price audit. If it doesn't find more than it costs, you get the fee back.",
  secondary: "See the offer",
} as const;

export const PROBLEM = {
  heading: "Everyone has tried AI. Few got their time back.",
  intro:
    "The work is usually clear. Where AI fits, and how to make it stick, is not.",
  label: "Problem",
} as const;

/** Numbers from Amartya's engineering work before this practice, shown under the hero. */
export const TRACK_RECORD = {
  label: "My track record as an engineer",
  link: "More about me",
  stats: [
    {
      label: "Airlines on an airport app I worked on at Amadeus",
      value: "20+",
    },
    { label: "In transactions through systems I built", value: "$2.3M+" },
    { label: "Failure rate on those systems, down from 19%", value: "3%" },
    { label: "Downloads of developer tools I built", value: "60,000+" },
  ],
} as const;

export const FIT = {
  audiences: [
    { chores: "Proposals, invoices, follow-ups", title: "Solo founders" },
    {
      chores: "Client reports, status updates, onboarding",
      title: "Agencies",
    },
    {
      chores: "Qualifying leads, the CRM, support triage",
      title: "Small teams",
    },
  ],
  good: [
    "You do the same work by hand every week: chasing, copying, drafting, updating.",
    "You've tried AI on your own, and it hasn't stuck.",
    "You'd rather have one thing working than a plan for ten.",
  ],
  goodLabel: "Works well when",
  heading: "If you do it by hand every week, it's worth a look.",
  label: "Who it's for",
  notGood: [
    "You want a chatbot because everyone has one.",
    "You want a strategy deck, not a working system.",
  ],
  notGoodLabel: "Not a fit when",
} as const;

export const OFFER = {
  deliverables: [
    {
      detail:
        "A kickoff, then 3-5 short calls with the people who do the work. I learn how the work actually runs, not how it is written down.",
      id: "calls",
      title: "Calls with your team",
    },
    {
      detail:
        "Every workflow in scope, with the tools it touches and the handoffs where time goes missing.",
      id: "map",
      title: "A map of the work",
    },
    {
      detail:
        "Every opportunity labeled Adopt, Automate, or Build, ranked by what it gives back, plus the work that only looks automatable and isn't worth it.",
      id: "ranked",
      title: "A ranked list",
    },
    {
      detail:
        "Cost, timeline, and payback estimates for the top three, with the assumptions written down so you can check them.",
      id: "estimates",
      title: "Estimates for the top three",
    },
    {
      detail:
        "The number-one opportunity, tried on your real examples, so you can see it work before you decide on a build.",
      id: "test",
      title: "A live test",
    },
    {
      detail:
        "A 90-day plan for the first change, a written report you keep, and a 45-60 minute recorded walkthrough.",
      id: "plan",
      title: "A plan and a report",
    },
  ],
  deliverablesHeading: "What you get",
  heading: "AI Opportunity Audit",
  intro:
    "A fixed-price look at how your work actually runs. You leave with a ranked plan and a test on your own examples.",
  label: "Offer",
  price: {
    capacity: "I take one audit at a time.",
    label: "Fixed price",
    launchLabel: "Fixed launch price",
    terms: [
      "The audit fee is credited in full toward a build started within 60 days.",
      "If the audit doesn't find anything worth more than its fee, you get the fee back.",
      "The report is yours. Build with me, hand it to someone else, or shelve it.",
    ],
  },
  specs: [
    { detail: "Kickoff to walkthrough", label: "Timeline", value: "7-10 days" },
    {
      detail: "Kickoff, calls, walkthrough",
      label: "Your team's time",
      value: "About 4-6 hours",
    },
  ],
} as const;

/** `{price}` is filled with the audit price from `getAuditPrice()`. */
export const PROCESS = {
  heading: "Four steps. The call is free, and you decide after each one.",
  label: "Process",
  leaveLabel: "You leave with",
  more: {
    body: "Those are quoted separately. The usual starting point is the audit.",
    lead: "I also build internal tools, and I fix vibe-coded software that needs to be stable enough to run in production.",
  },
  steps: [
    {
      leave: "A straight answer on whether an audit is worth it",
      meta: "15 min · free",
      name: "Talk",
      promise: "A 15-minute call to see if there's a real problem.",
    },
    {
      leave: "A report you keep and a tested first step",
      meta: "7-10 days · {price} fixed",
      name: "Audit",
      promise: "A ranked plan, and a test on your own examples.",
    },
    {
      leave: "A working system you own, plus 30 days of support",
      meta: "2-4 weeks · fixed quote",
      name: "Build",
      promise: "The first workflow, in the tools you already use.",
    },
    {
      leave: "Time back, every week after",
      meta: "Monthly · quoted after the build",
      name: "Run",
      promise: "It keeps running, and the next workflow gets built.",
    },
  ],
} as const;

export const ABOUT = {
  heading: "Amartya Singh",
  intro:
    "You talk to the person who does the work. No salespeople, no hand-offs.",
  label: "About",
  links: [
    { href: "https://github.com/decocereus", label: "GitHub" },
    { href: "https://www.linkedin.com/in/amartyasingh07/", label: "LinkedIn" },
    { href: "https://x.com/decocereus", label: "X" },
    { href: "https://www.decocereus.com", label: "decocereus.com" },
  ],
  linksLabel: "Check my work",
  rules: [
    "Only the access the work needs.",
    "Your data never trains AI models.",
    "You own everything I build.",
    "Nothing messages your customers without your OK.",
  ],
  rulesLabel: "Ground rules",
  studied: "Studied Computer Science at King's College London.",
} as const;

/** `{price}` is filled with the audit price from `getAuditPrice()`. */
export const FAQ = {
  heading: "Questions",
  items: [
    {
      answer:
        "{price}, fixed. Start a build within 60 days and the fee comes off it.",
      question: "What does the audit cost?",
    },
    {
      answer:
        "We skip the audit. I quote a fixed price for the build after a short call.",
      question: "What if we already know what to build?",
    },
    {
      answer:
        "About 4-6 hours over 7-10 days: a kickoff, a few short calls, and the walkthrough.",
      question: "How much of our time does it take?",
    },
    {
      answer: "No. You show me how the work runs, and I do the setup.",
      question: "Do we need to be technical?",
    },
    {
      answer:
        "The ones you already use: email, docs, chat, your CRM, and tools like ChatGPT, Claude, Zapier, or n8n.",
      question: "What tools do you work with?",
    },
    {
      answer: "Yes, before the call if you like.",
      question: "Can you sign an NDA?",
    },
    {
      answer:
        "30 days of support for small fixes. After that, an optional monthly retainer.",
      question: "What happens after the build?",
    },
  ],
  label: "FAQ",
} as const;

export const CLOSE = {
  body: "Book 15 minutes and walk me through it. I reply the same day, and I'll sign an NDA first if you need one.",
  headline: "What do you do by hand every week?",
} as const;
