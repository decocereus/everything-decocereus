import "../../iso/iso.css";
import "./automate.css";
import {
  aiModule,
  benchArt,
  cards,
  crankHandle,
  crankHub,
  crankShaft,
  EXIT_CLIP,
  gate,
  halos,
  hoppers,
  keyCap,
  layerA,
  layerC,
  PIPS,
  paperRoll,
  platen,
  platenFront,
  pressHead,
  report,
  rollFrontBracket,
  sendFront,
  writerBody,
  writerBracketBack,
} from "./art.tsx";
import { AutomateLive } from "./live.tsx";
import { FIGURE_LABEL, FIGURE_TITLE } from "./model.ts";

const ART = {
  aiModule,
  bench: benchArt,
  cards,
  crankHandle,
  crankHub,
  crankShaft,
  exitClip: EXIT_CLIP,
  gate,
  halos,
  hoppers,
  keyCap,
  layerA,
  layerC,
  paperRoll,
  pips: PIPS,
  platen,
  platenFront,
  pressHead,
  report,
  rollFrontBracket,
  sendFront,
  writerBody,
  writerBracketBack,
};

/** One weekly task, taken apart, given an AI module, and left to run. An illustrative example. */
export function AutomateFigure({ className = "" }: { className?: string }) {
  return (
    <figure
      className={`iso automate rounded-xl border border-rule bg-paper ${className}`}
      data-theme="light"
    >
      <figcaption className="flex items-center justify-between gap-4 border-rule border-b px-5 py-3 font-mono text-[12px] text-muted uppercase tracking-[0.08em] sm:px-6">
        <span>{FIGURE_LABEL}</span>
        <span className="hidden sm:inline">{FIGURE_TITLE}</span>
      </figcaption>
      <AutomateLive art={ART} />
    </figure>
  );
}
