import type * as React from "react";
import "../../iso/iso.css";
import "./clock.css";
import { ASSEMBLIES, DEFS, FIT, HEIGHT, shiftFor, WIDTH } from "./geometry.ts";
import { ClockMotion } from "./motion.tsx";
import { type Node, num } from "./plane.ts";

// The open-up on load: a spring sampled into a CSS linear() curve, so the
// parts spread from the near-assembled pose before any script runs.
const SPRING = (() => {
  const damping = 0.86;
  const omega = 4.6 / (damping * 0.95);
  const ring = omega * Math.sqrt(1 - damping * damping);
  const stops: string[] = [];
  for (let index = 0; index <= 20; index += 1) {
    const t = (index / 20) * 1.15;
    const x =
      1 -
      Math.exp(-damping * omega * t) *
        (Math.cos(ring * t) + ((damping * omega) / ring) * Math.sin(ring * t));
    stops.push(index === 20 ? "1" : x.toFixed(3));
  }
  return `linear(${stops.join(", ")})`;
})();

// Outer parts leave first, so no gap ever closes while the clock opens.
const DELAYS = (() => {
  const zs = ASSEMBLIES.map((part) => part.z);
  const middle = (Math.min(...zs) + Math.max(...zs)) / 2;
  const reach = Math.max(...zs.map((z) => Math.abs(z - middle)));
  return ASSEMBLIES.map(
    (part) => 0.32 * (1 - Math.abs(part.z - middle) / reach)
  );
})();

function render(node: Node, key: string): React.ReactNode {
  if (node.kind === "path") {
    return (
      <path
        className={node.cls}
        d={node.d}
        data-shade={node.shade}
        data-tone={node.tone}
        fillRule={node.evenodd ? "evenodd" : undefined}
        key={key}
        opacity={node.opacity}
      />
    );
  }
  if (node.kind === "use") {
    return (
      <use
        className={node.cls}
        data-spin={node.spin}
        href={node.href}
        key={key}
      />
    );
  }
  const children: React.ReactNode[] = [];
  for (const [index, child] of node.children.entries()) {
    children.push(render(child, `${key}.${index}`));
  }
  return (
    <g
      className={node.cls}
      data-spin={node.spin}
      key={key}
      transform={node.transform}
    >
      {children}
    </g>
  );
}

function Art() {
  const parts: React.ReactNode[] = [];
  for (const [index, part] of [...ASSEMBLIES].reverse().entries()) {
    const from = shiftFor(part.z, part.near);
    const order = ASSEMBLIES.length - 1 - index;
    const children: React.ReactNode[] = [];
    for (const [at, node] of part.nodes.entries()) {
      children.push(render(node, `${part.name}.${at}`));
    }
    parts.push(
      <g
        className="ck-assembly"
        data-part={part.name}
        key={part.name}
        style={
          {
            "--ck-delay": `${(DELAYS[order] ?? 0).toFixed(2)}s`,
            "--ck-x": `${num(from[0])}px`,
            "--ck-y": `${num(from[1])}px`,
          } as React.CSSProperties
        }
      >
        {children}
      </g>
    );
  }
  return (
    <svg
      aria-hidden="true"
      className="iso-svg ck-svg"
      focusable="false"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    >
      <defs>
        {DEFS.map((def) => (
          <path
            d={def.d}
            fillRule="evenodd"
            id={def.id}
            key={def.id}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </defs>
      <g
        transform={`matrix(${FIT.matrix.map((value) => value.toFixed(4)).join(" ")})`}
      >
        {parts}
      </g>
    </svg>
  );
}

const ART = <Art key="clock-art" />;

export function ClockFigure({ className }: { className?: string }) {
  return (
    <ClockMotion
      className={className ? `iso ck ${className}` : "iso ck"}
      spring={SPRING}
    >
      {ART}
    </ClockMotion>
  );
}
