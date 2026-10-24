"use client";

import { PaperTexture } from "@paper-design/shaders-react";

export function PaperGrain() {
  return (
    <PaperTexture
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
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
  );
}
