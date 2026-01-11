import { PROJECTS } from "@everything/constants";
import { Timeline, TimelineItem } from "./timeline";
import Link from "next/link";

const Projects = () => {
  return (
    <section id="projects" className="w-full max-w-3xl mx-auto py-20">
      <h2 className="text-2xl font-medium mb-12 text-foreground">Projects</h2>

      <Timeline>
        {Object.entries(PROJECTS).map(([id, project], idx) => (
          <TimelineItem key={id}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">
                  {project.name}
                </h3>
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  View
                </Link>
              </div>

              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {project.tech.map((tech, idx) => (
                  <span key={tech} className="text-xs text-muted-foreground">
                    {tech}
                    {idx < project.tech.length - 1 ? " · " : ""}
                  </span>
                ))}
              </div>
            </div>
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
};

export default Projects;
