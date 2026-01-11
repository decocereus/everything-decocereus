import { Timeline, TimelineItem } from "./timeline";

const IndieProjects = [
  {
    name: "Resume Builder",
    link: "https://easy-resumes.vercel.app/",
    description: "Generate a personal resume in one of several modern templates with instant PDF export.",
    tech: ["Next.js", "TypeScript", "PDF Generator"],
    status: "Launched",
  },
  {
    name: "Fitness Tracker",
    link: "https://gamp-fitness.vercel.app/",
    description: "Fitness tracker where users can start challenges and compete on a leaderboard using Postgres-backed server routes.",
    tech: ["Next.js", "TypeScript", "PostgreSQL"],
    status: "Launched",
  },
  {
    name: "Git Receipts",
    link: "https://gitreceipts.vercel.app/",
    description: "GitHub contribution generator that renders a receipt-style contribution chart using fetched GraphQL data.",
    tech: ["Next.js", "TypeScript", "GraphQL", "NextAuth"],
    status: "Launched",
  },
  {
    name: "Visited",
    link: "https://visited-client.vercel.app/",
    description: "Web app + Chrome extension that tracks and displays public URLs visited by a user.",
    tech: ["Next.js", "TypeScript", "Node.js", "Chrome Extension"],
    status: "Launched",
  },
  {
    name: "Developer Tool (WIP)",
    link: "#",
    description: "Building a new tool for developers. More details coming soon.",
    tech: ["Next.js", "TypeScript"],
    status: "In Progress",
  },
];

const IndieHacking = () => {
  return (
    <section
      id="indie-hacking"
      className="w-full max-w-3xl mx-auto py-12 animate-fadeIn transition-all duration-500"
    >
      <h2 className="text-2xl font-medium mb-8 text-foreground">Indie Hacking Journey</h2>

      <div className="space-y-6">
        <div className="text-sm text-muted-foreground">
          <p className="mb-4">
            Beyond my day job, I'm passionate about building products that solve real problems.
            Here's what I've shipped and what I'm working on.
          </p>
          <p>
            All projects are built with modern stacks, deployed on Vercel, and focused on developer experience.
          </p>
        </div>

        <Timeline>
          {IndieProjects.map((project, idx) => (
            <TimelineItem key={idx}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-foreground">
                    {project.name}
                  </h3>
                  {project.link !== "#" && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      View
                    </a>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    project.status === "Launched"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-yellow-500/10 text-yellow-500"
                  }`}>
                    {project.status}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIdx) => (
                      <span key={tech} className="text-xs text-muted-foreground">
                        {tech}
                        {techIdx < project.tech.length - 1 ? " · " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </TimelineItem>
          ))}
        </Timeline>

        <div className="mt-8 pt-6 border-t">
          <h3 className="text-sm font-medium text-foreground mb-2">Want to follow my journey?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Read about my indie hacking experiments, learnings, and progress on my blog.
          </p>
          <a
            href="https://blog.decocereus.dev"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Visit my blog →
          </a>
        </div>
      </div>
    </section>
  );
};

export default IndieHacking;
