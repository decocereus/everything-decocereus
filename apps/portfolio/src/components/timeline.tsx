import { cn } from "@everything/ui";
import type React from "react";

interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

export function Timeline({ children, className }: Readonly<TimelineProps>) {
  return (
    <div
      className={cn(
        "relative space-y-12 before:absolute before:inset-0 before:ml-3 before:h-full before:w-px before:-translate-x-1/2 before:bg-border",
        className
      )}
    >
      {children}
    </div>
  );
}

interface TimelineItemProps {
  children: React.ReactNode;
  className?: string;
  date?: string;
}

export function TimelineItem({
  children,
  className,
  date,
}: Readonly<TimelineItemProps>) {
  return (
    <div className={cn("relative flex gap-6", className)}>
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background border border-border">
        <div className="h-2 w-2 rounded-full bg-highlight"></div>
      </div>
      <div className="flex-1">
        {date && (
          <div className="text-sm text-muted-foreground lg:absolute lg:left-0 lg:top-0.5 lg:whitespace-nowrap  lg:-translate-x-[calc(100%+1rem)]">
            {date}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
