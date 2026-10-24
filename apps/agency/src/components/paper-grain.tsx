"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

const PaperTexture = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.PaperTexture),
  { ssr: false }
);

export function PaperGrain() {
  const [near, setNear] = useState(false);

  const watch = useCallback((node: HTMLDivElement) => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      ref={watch}
    >
      {near ? (
        <PaperTexture
          className="size-full"
          colorBack="#ffffff"
          colorPaper="#ffffff"
          colorShadow="#efefef"
          crumples={0}
          drops={0}
          fiber={0.2}
          folds={0}
          roughness={0.25}
          speed={0}
          wrinkles={0}
        />
      ) : null}
    </div>
  );
}
