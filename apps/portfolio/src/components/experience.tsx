import { EXPERIENCE } from "@everything/constants";
import { Timeline, TimelineItem } from "./timeline";
import Link from "next/link";

const Experience = () => {
  return (
    <section
      id="experience"
      className="w-full max-w-3xl mx-auto py-12 animate-fadeIn transition-all duration-500"
    >
      <h2 className="text-2xl font-medium mb-12 text-foreground">Experience</h2>

      <Timeline>
        {Object.entries(EXPERIENCE).map(([period, exp], idx) => (
          <TimelineItem key={period} date={`${exp.from} - ${exp.to}`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">
                  {exp.designation}
                </h3>
                <Link
                  href={exp.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {exp.company}
                </Link>
              </div>

              <p className="text-sm text-muted-foreground">{exp.tasks}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                {exp.tech.map((tech, idx) => (
                  <span key={tech} className="text-xs text-muted-foreground">
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
};

export default Experience;
