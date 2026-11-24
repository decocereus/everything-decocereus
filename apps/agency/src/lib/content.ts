export const NAV = [
  { href: "#offer", label: "Offer" },
  { href: "#process", label: "Process" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
] as const;

export const CTA = "Book a 15-minute call";

export const HERO = {
  body: "Most teams already have AI tools, and still lose hours to manual work or to tools that don't fit. I start with a short paid audit of how the work actually runs, show you where AI belongs, and build only what will stick.",
  eyebrow: "AI Opportunity Audit",
  headline: "Get your company's time back.",
  secondary: "See the offer",
} as const;

/** The three steps the share image uses to say what we do at thumbnail size. */
export const SHARE_STEPS = [
  "Audit how you work",
  "Find where AI fits",
  "Build what sticks",
] as const;

/** The hero figure: one illustrative work week. Hours run 9 to 17. */
export const WEEK = {
  blocks: [
    { day: 0, from: 9, kind: "manual", label: "Updates", to: 10 },
    { day: 0, from: 11, kind: "meeting", label: "Planning", to: 12 },
    { day: 0, from: 14, kind: "manual", label: "Copy data", to: 16 },
    { day: 1, from: 10, kind: "meeting", label: "Calls", to: 11 },
    { day: 1, from: 13, kind: "manual", label: "Handoffs", to: 15 },
    { day: 2, from: 9, kind: "manual", label: "Updates", to: 10 },
    { day: 2, from: 12, kind: "meeting", label: "Review", to: 13 },
    { day: 2, from: 15, kind: "manual", label: "Follow-ups", to: 17 },
    { day: 3, from: 9, kind: "meeting", label: "Standup", to: 10 },
    { day: 3, from: 11, kind: "manual", label: "Reports", to: 13 },
    { day: 3, from: 15, kind: "meeting", label: "Hiring", to: 16 },
    { day: 4, from: 9, kind: "manual", label: "Weekly report", to: 11 },
    { day: 4, from: 13, kind: "meeting", label: "Calls", to: 14 },
    { day: 4, from: 14, kind: "manual", label: "Follow-ups", to: 16 },
  ],
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  hours: [9, 17],
  legend: { back: "Time back", manual: "Manual work", meeting: "Other work" },
  title: "One week, illustrative",
} as const;

export const PROBLEM = {
  heading: "Where the time goes",
  intro: "The work is usually clear. The bottleneck is not.",
  items: [
    {
      detail:
        "Status updates, handoffs, reports, and follow-ups still move through inboxes and spreadsheets, and the same hours disappear every week.",
      title: "Manual work that should already be a system.",
    },
    {
      detail:
        "The team has tried ChatGPT or a few automations, but there is no ranked view of which work is worth changing, and which to leave alone.",
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
    "A kickoff, then 3-5 interviews with the people who do the work.",
    "A map of the workflows in scope, including tools and handoffs.",
    "A ranked list of opportunities, labeled Adopt, Automate, or Build, including what to skip.",
    "Cost, timeline, and payback estimates for the top three, with the assumptions written down.",
    "A live test of the number-one opportunity on your real examples.",
    "A 90-day plan for the first change.",
    "A written report you keep, and a 45-60 minute recorded walkthrough.",
  ],
  deliverablesHeading: "What you get",
  heading: "AI Opportunity Audit",
  intro:
    "A fixed-price look at how one team actually works, with a live test on your real examples. You leave with a written plan you own, whether or not we build anything together.",
  label: "Offer",
  price: {
    after: "for the first two teams, then USD 1,500.",
    amount: "USD 999",
    terms: [
      "The audit fee is credited in full toward a build started within 60 days.",
      "If the audit doesn't find anything worth more than its fee, you get the fee back.",
      "The report is yours either way.",
    ],
  },
  specs: [
    { detail: "Kickoff to walkthrough", label: "Timeline", value: "7-10 days" },
    {
      detail: "Kickoff, interviews, walkthrough",
      label: "Your team's time",
      value: "About 4-6 hours",
    },
  ],
} as const;

export const PROCESS = {
  heading: "How it works",
  label: "Process",
  more: "I also build internal tools, and I fix vibe-coded software that needs to be stable enough to run in production. Those are quoted separately. The usual starting point is the audit.",
  steps: [
    {
      detail:
        "Tell me how the work runs. I'll tell you honestly whether an audit is the right next step. If you already know exactly what to build, we skip the audit and I'll quote the build.",
      length: "Free, 15 minutes",
      title: "Intro call",
    },
    {
      detail: "The work above, on your real workflows and examples.",
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
  facts: [
    {
      label: "Started",
      value:
        "As an engineer at Amadeus in London, on an airport-operations app used by 20+ airlines.",
    },
    {
      label: "Built",
      value:
        "Systems that have handled $2.3M+ in transactions, with failures cut from 19% to 3%.",
    },
    {
      label: "Also built",
      value: "Developer tools that have been downloaded 60,000+ times.",
    },
    { label: "Studied", value: "Computer Science at King's College London." },
  ],
  heading: "Amartya Singh",
  intro:
    "I'll be on the call, and I'm the one who does the work. There is no hand-off to a salesperson.",
  label: "About",
  note: "Until there is a published client result, the audit includes a live test on your examples so you can judge the work yourself.",
} as const;

export const FAQ = {
  heading: "Questions",
  items: [
    {
      answer:
        "USD 999 for the first two teams, then USD 1,500. If we start a build within 60 days, the audit fee comes off that build. If the audit doesn't find anything worth more than its fee, you get the fee back.",
      question: "What does the audit cost?",
    },
    {
      answer:
        "We skip the audit. I'll quote a fixed price for the build after a short call.",
      question: "What if we already know what to build?",
    },
    {
      answer:
        "About 4-6 hours over 7-10 days: a kickoff and a few interviews, then a walkthrough of the report. In between, I work async and only ask when I need an answer.",
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
      answer:
        "Only with wording you've approved. Standard messages can be signed off once. Everything else waits for your OK.",
      question: "Will anything message our customers on its own?",
    },
    {
      answer:
        "I never use your data to train AI models. I take only the access the work needs, and you own everything I build: the accounts, the setup, and the data.",
      question: "Is our data safe?",
    },
    {
      answer: "Yes. I take calls in UK hours and US Eastern hours.",
      question: "Do you work in our timezone?",
    },
    {
      answer:
        "The first clients I'm taking are startup founders and ops teams at mid-size companies. If the problem is messy operational work, book a call and I'll tell you if it's a fit.",
      question: "Do you only work with startups?",
    },
  ],
  label: "FAQ",
} as const;

export const CLOSE = {
  body: "If the audit is a fit, you'll know by the end of the call. If it isn't, I'll say so.",
  headline: "Start with a 15-minute call.",
} as const;
