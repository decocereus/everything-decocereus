export const NAV = [
  { href: "#example", label: "Example" },
  { href: "#how", label: "How it works" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
] as const;

export const CTA = {
  close: "Book a free intro call",
  header: "Book a free call",
  hero: "Book a free 30-minute intro call",
} as const;

export const HERO = {
  body: "We start with a two-week audit of how your week runs and show you which tasks cost the most hours. If it doesn't find 10+ hours a week, the audit is free. Then we build AI agents that do that work, on the tools you already use.",
  headline: "Stop losing evenings to paperwork and leads to voicemail.",
  secondary: "See an example",
} as const;

export const WORK = {
  heading: "Work we take off your plate",
  intro:
    "Some examples. Every setup is built around how your business already runs.",
  items: [
    {
      detail:
        "When you can't pick up, the caller gets a text right away with a link to book.",
      saves: "the jobs that go to whoever answers first.",
      title: "Missed calls",
    },
    {
      detail:
        "Your notes or voice memo from the job become a draft quote in your template, ready to check and send.",
      saves: "the evening spent writing quotes.",
      title: "Quotes",
    },
    {
      detail:
        "Overdue invoices get polite reminders on a schedule, and you see who has paid.",
      saves: "the awkward calls, and cash sitting unpaid.",
      title: "Invoice chasing",
    },
    {
      detail:
        "One message at 7am covers yesterday's calls, jobs booked, money in and out, and what needs you.",
      saves: "piecing it together from five apps.",
      title: "Morning summary",
    },
  ],
} as const;

export const STEPS = {
  consulting: {
    detail:
      "If you run ChatGPT, Claude, Zapier or n8n and aren't getting results, we'll review your setup and fix it.",
    title: "Already using AI tools?",
  },
  guarantee:
    "If the audit doesn't find 10+ hours a week, you don't pay for it. If it does and you go ahead, the audit fee comes off the build.",
  heading: "How it works",
  items: [
    {
      detail:
        "Tell us how the business runs, and we'll tell you honestly whether we can help.",
      length: "Free, 30 minutes",
      title: "Intro call",
    },
    {
      detail:
        "We map how your week runs and hand you a ranked list of the tasks that cost the most hours, and what fixing each one is worth. For example: “these 4 tasks cost you 14 hours a week.” (Illustrative.)",
      length: "Two weeks",
      title: "Audit",
    },
    {
      detail:
        "We set up the top two or three agents on the tools you already use.",
      length: "Two to four weeks",
      title: "Build",
    },
    {
      detail:
        "We keep the agents running, add new ones, and send you a weekly report of the hours saved.",
      length: "Monthly",
      title: "Retainer",
    },
  ],
  price: "Every step is a fixed price, quoted after the intro call.",
} as const;

export const CONTROL = {
  heading: "You stay in charge",
  items: [
    {
      detail:
        "Agents draft and queue. Anything meant for a customer waits for your OK.",
      title: "You approve what goes out",
    },
    {
      detail: "Every week you get a report of the time the agents saved.",
      title: "You see the hours saved",
    },
  ],
} as const;

export const FOUNDER = {
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
    "I'll be on your intro call, and I'm the one who builds your agents. No hand-off to a salesperson.",
} as const;

export const FAQ = {
  heading: "Questions",
  items: [
    {
      answer: "If it doesn't find 10+ hours a week, the audit is free.",
      question: "What if the audit finds nothing?",
    },
    {
      answer:
        "One 60-minute kickoff. After that we work async and send short questions when we need answers.",
      question: "How much of my team's time does it take?",
    },
    {
      answer:
        "No. We set everything up and show your team the parts they touch.",
      question: "Do I need to be technical?",
    },
    {
      answer:
        "The ones you already use: your phone, email, calendar, job software and accounting tools. If you already use ChatGPT, Claude, Zapier or n8n, we build on those.",
      question: "What tools do you work with?",
    },
    {
      answer:
        "Only with wording you've approved. You sign off the wording of standard messages, like the missed-call text, once. Anything else waits for your OK.",
      question: "Will an agent message my customers on its own?",
    },
    {
      answer:
        "We never use your data to train AI models. Agents get only the access they need, and you own everything we build: the accounts, the setup and the data.",
      question: "Is my data safe?",
    },
    {
      answer: "Yes. We take calls in UK hours and US Eastern hours.",
      question: "Do you work in my timezone?",
    },
    {
      answer:
        "A fixed price for each step, quoted after the intro call, once we know how your business runs.",
      question: "What does it cost?",
    },
  ],
} as const;

export const CLOSE = {
  body: "Book a free 30-minute intro call. Tell us how your week runs, and we'll tell you honestly what agents can take off it.",
  headline: "Find out where your week goes.",
} as const;
