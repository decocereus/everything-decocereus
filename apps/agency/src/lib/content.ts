export const NAV = [
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
  lead: "We find the work that eats your week, then build the AI agents, automations, and internal tools that take it over.",
  promise:
    "Fixed-price audit. If it doesn't find more than it costs, you get the fee back.",
  secondary: "See the offer",
} as const;

export const PROBLEM = {
  heading: "Where the time goes",
  intro: "The work is usually clear. The bottleneck is not.",
  items: [
    {
      detail:
        "Information still moves between inboxes, spreadsheets, and tools by hand, and the same hours disappear every week.",
      title: "Manual work that should already be a system.",
    },
    {
      detail:
        "The team has tried Claude or a few automations, but there is no ranked view of which work is worth changing, and which to leave alone.",
      title: "No clear picture of where AI fits.",
    },
    {
      detail:
        "The model is fine. It just never sees the real policies, past decisions, or examples, so people stop trusting it and go back to doing the work themselves.",
      title: "Tools that don't work in practice.",
    },
  ],
  label: "Problem",
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
    "A fixed-price look at how one team actually works. You leave with a working test on your own examples, not a slide deck.",
  label: "Offer",
  price: {
    capacity: "I take one audit at a time.",
    label: "Fixed price",
    launchLabel: "Fixed launch price",
    terms: [
      "The audit fee is credited in full toward a build started within 60 days.",
      "If the audit doesn't find anything worth more than its fee, you get the fee back.",
      "The report is yours. Build with us, hand it to someone else, or shelve it.",
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

export const PROCESS = {
  heading: "How it works",
  label: "Process",
  more: {
    body: "Those are quoted separately. The usual starting point is the audit.",
    lead: "I also build internal tools, and I fix vibe-coded software that needs to be stable enough to run in production.",
  },
  steps: [
    {
      detail:
        "Tell me how the work runs and where the hours go. I ask the questions, so there's nothing to prepare.",
      length: "Free, 15 minutes",
      title: "Intro call",
    },
    {
      detail:
        "Everything in the offer above. Between calls I work async and only ask when I need an answer.",
      length: "7-10 days",
      title: "Audit",
    },
    {
      detail:
        "I build the first workflow in the tools you already use, test it with the people who do the work, and hand it over. Fixed price, quoted after the audit.",
      length: "Usually 2-4 weeks",
      title: "Build",
    },
    {
      detail:
        "I keep the system running, make small improvements, and take on the next workflow. Quoted after the build.",
      length: "Monthly",
      title: "Retainer",
    },
  ],
} as const;

export const ABOUT = {
  heading: "Amartya Singh",
  intro:
    "I'll be on the call, and I'm the one who does the work. There is no hand-off to a salesperson.",
  label: "About",
  links: [
    { href: "https://github.com/decocereus", label: "GitHub" },
    { href: "https://www.linkedin.com/in/amartyasingh07/", label: "LinkedIn" },
    { href: "https://x.com/decocereus", label: "X" },
    { href: "https://www.decocereus.com", label: "decocereus.com" },
  ],
  linksLabel: "Check my work",
  note: "Until there is a published client result, the audit includes a live test on your examples so you can judge the work yourself.",
  rules: [
    "I take only the access the work needs.",
    "Your data is never used to train AI models.",
    "You own everything I build: the accounts, the setup, and the data.",
    "Nothing messages your customers without your OK.",
  ],
  rulesLabel: "Ground rules",
  stats: [
    {
      label:
        "Airlines on the airport-operations app I worked on as an engineer at Amadeus in London",
      value: "20+",
    },
    { label: "In transactions through systems I built", value: "$2.3M+" },
    { label: "Failure rate on those systems, down from 19%", value: "3%" },
    { label: "Downloads of developer tools I built", value: "60,000+" },
  ],
  studied: "Studied Computer Science at King's College London.",
} as const;

/** `{price}` is filled with the audit price from `getAuditPrice()`. */
export const FAQ = {
  heading: "Questions",
  items: [
    {
      answer:
        "{price}, fixed. If we start a build within 60 days, the audit fee comes off that build.",
      question: "What does the audit cost?",
    },
    {
      answer:
        "We skip the audit. I'll quote a fixed price for the build after a short call.",
      question: "What if we already know what to build?",
    },
    {
      answer:
        "About 4-6 hours over 7-10 days: a kickoff call, a few short calls with the people who do the work, and a walkthrough of the report.",
      question: "How much of our time does it take?",
    },
    {
      answer:
        "No. You show me how the work runs. I set things up and show your team the parts they touch.",
      question: "Do we need to be technical?",
    },
    {
      answer:
        "The ones you already use: email, calendar, docs, chat, your CRM or issue tracker, and whatever you use for finance or ops. If you already use ChatGPT, Claude, Zapier, or n8n, I build on those when they are the right fit.",
      question: "What tools do you work with?",
    },
    {
      answer: "Yes. I take calls in UK hours and US Eastern hours.",
      question: "Do you work in our timezone?",
    },
    {
      answer:
        "No. I work with anyone who has a problem worth solving. Book a call and tell me what it is.",
      question: "Do you only work with startups?",
    },
  ],
  label: "FAQ",
} as const;

export const CLOSE = {
  body: "Tell me on a 15-minute call. If the audit is a fit, you'll know by the end of it. If it isn't, I'll say so.",
  headline: "What do you do by hand every week?",
} as const;
