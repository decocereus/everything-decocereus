import Link from "next/link";
import { PROJECTS } from "@/lib/constants.ts";
import { Timeline, TimelineItem } from "./timeline.tsx";

const Projects = () => (
  <section className="mx-auto w-full max-w-3xl py-20" id="projects">
    <h2 className="mb-12 font-medium text-2xl text-foreground">Projects</h2>

    <Timeline>
      {Object.entries(PROJECTS).map(([id, project]) => (
        <TimelineItem key={id}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground text-lg">
                {project.name}
              </h3>
              <Link
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                href={project.link}
                rel="noreferrer"
                target="_blank"
              >
                View
              </Link>
            </div>

            <p className="text-muted-foreground text-sm">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {project.tech.map((tech, idx) => (
                <span className="text-muted-foreground text-xs" key={tech}>
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

export default Projects;
