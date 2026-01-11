"use client";
import { SKILL_TREE } from "@everything/constants";
import { useCallback, useEffect, useRef, useState } from "react";

type Skill = {
  name: string;
  level: "expert" | "advanced" | "intermediate" | "beginner";
};

type Category = {
  name: string;
  skills: Skill[];
};

type SkillTree = {
  [key: string]: Category;
};

const Skills = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      const isSmallScreen = width <= 768;
      setDimensions({
        width: Math.min(
          width - (isSmallScreen ? 16 : 32),
          isSmallScreen ? 750 : 1200
        ),
        height: isSmallScreen ? 700 : 800,
      });
    }
  }, []);

  const generatePaths = useCallback(() => {
    const paths = [];
    const nodeRadius = 4;
    const marginLeft = Math.max(100, dimensions.width * 0.12);
    const marginRight = Math.max(150, dimensions.width * 0.15);
    const usableWidth = Math.max(
      200,
      dimensions.width - (marginLeft + marginRight)
    );
    const centerX = marginLeft + usableWidth * 0.4;
    const categories = Object.keys(SKILL_TREE);
    const verticalSpacing = dimensions.height / (categories.length + 2);
    const horizontalSpacing = Math.min(
      dimensions.width <= 768 ? 90 : 120,
      dimensions.width * 0.12
    );
    const startY = dimensions.height - 60;
    const skillSpacing = dimensions.width <= 768 ? 70 : 85;

    paths.push(
      <path
        key="trunk"
        d={`M ${centerX} ${startY} L ${centerX} ${
          startY - verticalSpacing * categories.length
        }`}
        className="stroke-slate-500"
        strokeWidth={1.5}
      />
    );

    for (const [categoryIndex, category] of categories.entries()) {
      const categoryData = (SKILL_TREE as SkillTree)[category];
      const y = startY - verticalSpacing * (categoryIndex + 1);
      const isLeft = categoryIndex % 2 === 0;
      const direction = isLeft ? -1 : 1;
      const categoryBranchX = centerX + direction * horizontalSpacing;

      const categoryLabelOffset = dimensions.width <= 768 ? 25 : 35;
      const categoryLabelX = isLeft
        ? categoryBranchX - categoryLabelOffset
        : categoryBranchX + categoryLabelOffset;
      const categoryLabelY = y;

      paths.push(
        <g
          key={`category-${category}`}
          style={{ animationDelay: `${categoryIndex * 200}ms` }}
        >
          <path
            d={`M ${centerX} ${y} L ${categoryBranchX} ${y}`}
            className="stroke-slate-500 transition-all duration-300 hover:stroke-slate-300"
            strokeWidth={1.5}
          />
          <circle
            cx={categoryBranchX}
            cy={y}
            r={nodeRadius}
            className="fill-slate-950 stroke-slate-500 transition-all duration-300 hover:stroke-slate-300"
            strokeWidth={1.5}
          />
          <text
            x={categoryLabelX}
            y={categoryLabelY}
            className={`${
              dimensions.width <= 768 ? "text-sm" : "text-base"
            } fill-slate-50 font-bold transition-all duration-300`}
            textAnchor={isLeft ? "end" : "start"}
            dominantBaseline="middle"
          >
            {categoryData.name}
          </text>

          {categoryData.skills.map((skill: Skill, skillIndex: number) => {
            const skillY =
              y +
              (skillIndex - (categoryData.skills.length - 1) / 2) *
                skillSpacing;
            const baseSkillOffset = dimensions.width <= 768 ? 200 : 280;
            const skillX = categoryBranchX + direction * baseSkillOffset;

            const textOffset = dimensions.width <= 768 ? 18 : 26;
            const textX = isLeft ? skillX - textOffset : skillX + textOffset;

            return (
              <g
                key={`skill-${category}-${skillIndex}`}
                className="skill-branch opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]"
                style={{
                  animationDelay: `${
                    categoryIndex * 200 + (skillIndex + 1) * 100
                  }ms`,
                }}
              >
                <path
                  d={`M ${categoryBranchX} ${y} 
                      L ${categoryBranchX + direction * 50} ${y}
                      L ${categoryBranchX + direction * 50} ${skillY}
                      L ${skillX} ${skillY}`}
                  className="stroke-slate-600 transition-all duration-300 hover:stroke-slate-400"
                  strokeWidth={1}
                  fill="none"
                />
                <circle
                  cx={skillX}
                  cy={skillY}
                  r={nodeRadius}
                  className={`fill-slate-950 stroke-slate-600 transition-all duration-300 hover:stroke-slate-300 ${
                    skill.level === "expert" ? "stroke-2" : "stroke-1.5"
                  }`}
                />
                <text
                  x={textX}
                  y={skillY}
                  className={`${
                    dimensions.width <= 768 ? "text-xs" : "text-sm"
                  } fill-slate-300 font-medium transition-all duration-300 hover:fill-slate-50`}
                  textAnchor={isLeft ? "end" : "start"}
                  dominantBaseline="middle"
                  style={{ pointerEvents: "none" }}
                >
                  {skill.name}
                </text>
              </g>
            );
          })}
        </g>
      );
    }

    return paths;
  }, [dimensions]);

  return (
    <section
      id="skills"
      className="w-full select-none px-2 sm:px-4 md:px-8 flex items-center justify-center min-h-[700px] md:min-h-[800px] py-8"
      ref={containerRef}
    >
      <div className="w-full flex items-center justify-center">
        {dimensions.width > 0 && (
          <svg
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            width="100%"
            height={dimensions.height}
            style={{
              maxWidth: dimensions.width,
              minHeight: dimensions.width <= 768 ? "700px" : "800px",
            }}
            preserveAspectRatio="xMidYMid meet"
          >
            {generatePaths()}
          </svg>
        )}
      </div>
    </section>
  );
};

export default Skills;
