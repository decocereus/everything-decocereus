export const NAV = [
  { href: "#example", label: "Example" },
  { href: "#work", label: "What we automate" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
] as const;

export const HERO = {
  body: "We find where your week goes, build AI agents that take that work off your plate, and show you the hours you get back. Nothing reaches a customer without your OK.",
  headline: "Put AI agents to work on your busywork.",
  secondary: "See an example",
} as const;

export const WORK = {
  heading: "Work we hand to agents",
  intro:
    "A few examples. Every setup is built around how your business already runs.",
  items: [
    {
      detail:
        "Calls summarised into notes, follow-ups drafted, and nothing left hanging.",
      title: "Calls and follow-ups",
    },
    {
      detail:
        "Invoices drafted from finished work, and your books checked against the systems you already use.",
      title: "Invoices and books",
    },
    {
      detail:
        "Bookings confirmed, changes handled, and the inbox sorted before you open it.",
      title: "Scheduling and inbox",
    },
    {
      detail: "A short morning summary of what happened and what needs you.",
      title: "Daily reporting",
    },
  ],
} as const;

export const APPROACH = {
  heading: "How we work",
  items: [
    {
      detail:
        "We start with how your week actually runs and where the hours go.",
      title: "Look first",
    },
    {
      detail:
        "We build the few agents that give back the most time, around the tools you already use.",
      title: "Build what pays",
    },
    {
      detail:
        "We keep them running, improve them, and report the hours they save.",
      title: "Keep it running",
    },
  ],
} as const;

export const CONTROL = {
  heading: "You stay in charge",
  items: [
    {
      detail:
        "Agents draft and queue. Anything meant for a customer waits for your approval.",
      title: "You approve what goes out",
    },
    {
      detail: "Every setup reports the time it saved you, week by week.",
      title: "You see the hours saved",
    },
  ],
} as const;

export const FOUNDER = {
  facts: [
    {
      label: "Experience",
      value: "4+ years as a product engineer, starting at Amadeus in London.",
    },
    {
      label: "Built",
      value:
        "The Nexus SDK and UI packages, with more than 60,000 npm downloads.",
    },
    {
      label: "Led",
      value:
        "As primary technical owner, the backend layer that coordinates trades for ShieldTX: $2.3M+ in executed volume, and the failure rate on accepted orders cut from 19% to 3% between July and September 2026.",
    },
    { label: "Studied", value: "Computer Science at King's College London." },
  ],
  heading: "Built by an engineer",
  intro:
    "Amartya Singh founded Agency. You talk to the person who builds your agents, not a salesperson.",
} as const;

export const FAQ = {
  heading: "Questions",
  items: [
    {
      answer:
        "No. We set everything up and show your team the parts they touch.",
      question: "Do I need to be technical?",
    },
    {
      answer:
        "No. Agents draft and queue. Anything that reaches a customer waits for your approval.",
      question: "Will an agent message my customers on its own?",
    },
    {
      answer:
        "Amartya, the founder. The person you talk to is the one who builds it.",
      question: "Who builds it?",
    },
    {
      answer:
        "It depends on what we build. After a first call we'll tell you what we'd build and what it costs.",
      question: "What does it cost?",
    },
  ],
} as const;

export const CLOSE = {
  body: "Tell us how your week runs. We'll tell you honestly what agents can take off it.",
  headline: "Find out where your week goes.",
  pending:
    "Online booking opens soon. Until then, message us on X and we'll set up a time.",
} as const;
