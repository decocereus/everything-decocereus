import Link from "next/link";
import { EXPERIENCE } from "@/lib/constants.ts";
import { Timeline, TimelineItem } from "./timeline.tsx";

const Experience = () => (
  <section
    className="mx-auto w-full max-w-3xl animate-fadeIn py-12"
    id="experience"
  >
    <h2 className="mb-12 font-medium text-2xl text-foreground">Experience</h2>

    <Timeline>
      {Object.entries(EXPERIENCE).map(([period, exp]) => (
        <TimelineItem date={`${exp.from} - ${exp.to}`} key={period}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground text-lg">
                {exp.designation}
              </h3>
              <Link
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                href={exp.website}
                rel="noreferrer"
                target="_blank"
              >
                {exp.company}
              </Link>
            </div>

            <p className="text-muted-foreground text-sm">{exp.tasks}</p>

            <div className="flex flex-wrap gap-2 pt-2">
              {exp.tech.map((tech, idx) => (
                <span className="text-muted-foreground text-xs" key={tech}>
                  {tech}
                  {idx < exp.tech.length - 1 ? " · " : ""}
                </span>
              ))}
            </div>
          </div>
        </TimelineItem>
      ))}
    </Timeline>
  </section>
);

export default Experience;
