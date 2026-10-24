import { Fragment } from "react";
import { Dots, Line, Solid } from "../../iso/react/draw.tsx";
import {
  ARREST_ART,
  BALANCE_ART,
  BASE_ART,
  CLOCK_ART,
  DECK_ART,
  FALLING,
  GATE_ART,
  PRINTER_ART,
  RAIL_ART,
  REPORT_ART,
  SHUTTLE_ART,
  STACKS,
} from "./geometry.ts";
import { MorningOpsLive } from "./live.tsx";

// Static parts, built on the server and handed to the live component in painter's order.
// Every element prop has a keyed root (see the anatomy kit's react.md).

const BASE = (
  <g key="base">
    <path className="iso-halo" d={BASE_ART.halo} />
    {BASE_ART.feet.map((parts, index) => (
      <g key={`foot-${index.toString()}`}>
        <Solid crease="faint" paths={parts[0]} tone="lo" />
        <Solid crease="faint" paths={parts[1]} tone="mid" />
      </g>
    ))}
    <Solid
      inner={<Line d={BASE_ART.seam} tone="faint" />}
      paths={BASE_ART.slab}
      tone="mid"
    />
    <Line d={BASE_ART.groove} tone="lo" />
    <Line d={BASE_ART.screwRings} tone="lo" />
    <Dots points={BASE_ART.screws} size={0.5} />
    <Solid crease="none" paths={BASE_ART.label} tone="lo" />
    <Line d={BASE_ART.labelLine} tone="faint" />
    <Line d={BASE_ART.labelRules} free tone="lo" />
    <Dots points={BASE_ART.labelScrews} size={0.45} />
    <Solid crease="none" paths={BASE_ART.ruler} tone="lo" />
    <Line d={BASE_ART.rulerMinor} tone="lo" />
    <Line d={BASE_ART.rulerMajor} tone="mid" />
    <Line d={BASE_ART.rulerMarks} tone="hi" />
  </g>
);

const REPORT = (
  <g key="report">
    <path className="iso-halo" d={REPORT_ART.halo} />
    <Solid paths={REPORT_ART.board} tone="mid" />
    <Dots points={REPORT_ART.boardScrews} size={0.45} />
    <Solid crease="none" paths={REPORT_ART.sheet} tone="mid" />
    <Line d={REPORT_ART.header} free tone="mid" />
    <Line d={REPORT_ART.boxes} tone="mid" />
    <Line d={REPORT_ART.rules} free tone="lo" />
    <Solid paths={REPORT_ART.clip} tone="mid" />
    <Dots points={REPORT_ART.clipRivets} size={0.45} />
    <Solid crease="none" paths={REPORT_ART.clipBar} tone="mid" />
  </g>
);

const REPORT_TICKS = REPORT_ART.ticks.map((d, index) => (
  <g
    data-count={index + 1}
    key={`tick-${index.toString()}`}
    style={{ display: "none" }}
  >
    <Line d={d} free tone="hi" />
  </g>
));

const CLOCK = (
  <g key="clock">
    <path className="iso-halo" d={CLOCK_ART.halo} />
    <Solid paths={CLOCK_ART.plinth} tone="lo" />
    <Solid
      inner={<Line d={CLOCK_ART.bodySeam} tone="faint" />}
      paths={CLOCK_ART.body}
      tone="mid"
    />
    <Line d={CLOCK_ART.door} tone="lo" />
    <Dots points={CLOCK_ART.doorKnob} size={0.7} tone="hi" />
    <Dots points={CLOCK_ART.screws} size={0.45} />
    <Solid paths={CLOCK_ART.cap} tone="mid" />
    <Line d={CLOCK_ART.capInset} tone="faint" />
    <Solid crease="lo" paths={CLOCK_ART.bezel} tone="mid" />
    <Line d={CLOCK_ART.face} tone="lo" />
    <Line d={CLOCK_ART.night} tone="mid" />
    <Line d={CLOCK_ART.minor} tone="lo" />
    <Line d={CLOCK_ART.major} tone="hi" />
    <Solid crease="none" paths={CLOCK_ART.crown} tone="mid" />
    <Solid crease="lo" paths={CLOCK_ART.crownHead} tone="mid" />
  </g>
);

const CLOCK_HUB = (
  <g key="clock-hub">
    <Dots points={[CLOCK_ART.hub]} size={1} tone="hi" />
  </g>
);

const DECK_CAP = (
  <g key="deck-cap">
    <Solid paths={DECK_ART.cap} tone="hi" />
  </g>
);

const BAL_CAP = (
  <g key="bal-cap">
    <Solid paths={BALANCE_ART.cap} tone="hi" />
  </g>
);

const PRINTER_CAP = (
  <g key="printer-cap">
    <Solid paths={PRINTER_ART.cap} tone="hi" />
  </g>
);

const DECK_BACK = (
  <g key="deck-back">
    <path className="iso-halo" d={DECK_ART.halo} />
    <Solid
      inner={<Line d={DECK_ART.caseSeam} tone="faint" />}
      paths={DECK_ART.case}
      tone="mid"
    />
    <Line d={DECK_ART.groove} tone="lo" />
    <Dots points={DECK_ART.screws} size={0.5} />
    <Line d={DECK_ART.vents} tone="lo" />
    <Line d={DECK_ART.slot} tone="lo" />
    <Solid paths={DECK_ART.boss} tone="mid" />
    {DECK_ART.flanges.map((paths, index) => (
      <Solid key={`flange-${index.toString()}`} paths={paths} tone="mid" />
    ))}
    <Line d={DECK_ART.flangeRings} tone="faint" />
    <Solid paths={DECK_ART.headShield} tone="mid" />
    <Solid paths={DECK_ART.head} tone="hi" />
    <Line d={DECK_ART.headGap} tone="lo" />
  </g>
);

const DECK_HUBS = (
  <g key="deck-hubs">
    {DECK_ART.hubs.map((paths, index) => (
      <Solid key={`hub-${index.toString()}`} paths={paths} tone="mid" />
    ))}
    <Line d={DECK_ART.hubRings} tone="lo" />
  </g>
);

const DECK_FRONT = (
  <g key="deck-front">
    {DECK_ART.posts.map((paths, index) => (
      <Fragment key={`post-${index.toString()}`}>
        <Solid crease="none" paths={paths} tone="mid" />
        <Solid paths={DECK_ART.postCaps[index]} tone="mid" />
      </Fragment>
    ))}
    <Solid crease="none" paths={DECK_ART.capstan} tone="hi" />
    <Solid paths={DECK_ART.pinchArm} tone="mid" />
    <Solid paths={DECK_ART.pinch} tone="mid" />
    <Line d={DECK_ART.pinchRing} tone="lo" />
    <Line d={DECK_ART.keyWell} tone="faint" />
  </g>
);

const PLAY_KEY = (
  <g key="play-key">
    <Solid paths={DECK_ART.keys[0]} tone="hi" />
  </g>
);

const DECK_KEYS = (
  <g key="deck-keys">
    {DECK_ART.keys.slice(1).map((paths, index) => (
      <Solid key={`key-${index.toString()}`} paths={paths} tone="mid" />
    ))}
  </g>
);

const TRAY_BACK = (
  <g key="tray-back">
    <Solid paths={DECK_ART.trayFloor} tone="lo" />
    <Solid paths={DECK_ART.trayBack} tone="mid" />
    <Solid paths={DECK_ART.trayLeft} tone="mid" />
  </g>
);

const TRAY_FRONT = (
  <g key="tray-front">
    <Solid paths={DECK_ART.trayRight} tone="mid" />
    <Solid paths={DECK_ART.trayFront} tone="mid" />
    <Line d={DECK_ART.trayNotch} tone="lo" />
  </g>
);

const BAL_BACK = (
  <g key="bal-back">
    <path className="iso-halo" d={BALANCE_ART.halo} />
    <Solid paths={BALANCE_ART.plinth} tone="mid" />
    <Line d={BALANCE_ART.plinthGroove} tone="lo" />
    <Dots points={BALANCE_ART.plinthScrews} size={0.45} />
    <Solid paths={BALANCE_ART.boss} tone="mid" />
  </g>
);

const ARREST = (
  <g key="arrest">
    <Solid crease="none" paths={ARREST_ART.rod} tone="mid" />
    <Solid paths={ARREST_ART.pad} tone="mid" />
  </g>
);

const BAL_MID = (
  <g key="bal-mid">
    <Solid crease="none" paths={BALANCE_ART.arrestSleeve} tone="mid" />
    <Solid paths={BALANCE_ART.collar} tone="mid" />
    <Dots points={BALANCE_ART.collarScrews} size={0.45} />
    <Solid
      crease="none"
      inner={<Line d={BALANCE_ART.pillarSeam} tone="faint" />}
      paths={BALANCE_ART.pillar}
      tone="mid"
    />
    <Solid crease="none" paths={BALANCE_ART.stopSleeve} tone="mid" />
    <Solid paths={BALANCE_ART.stopPad} tone="lo" />
    <Solid paths={BALANCE_ART.saddle} tone="mid" />
    <Solid paths={BALANCE_ART.backCheek} tone="mid" />
  </g>
);

function panOf(side: 0 | 1) {
  const books = BALANCE_ART.books[side] ?? [];
  return (
    <g key={`pan-${side.toString()}`}>
      <Solid crease="none" paths={BALANCE_ART.stems[side]} tone="mid" />
      <Solid paths={BALANCE_ART.pans[side]} tone="mid" />
      <Line d={BALANCE_ART.panRims[side] ?? ""} tone="lo" />
      {books.map((book, index) => (
        <Solid
          inner={<Line d={book.seam} tone="faint" />}
          key={`book-${index.toString()}`}
          paths={book.paths}
          tone="hi"
        />
      ))}
    </g>
  );
}

const PAN_LEFT = panOf(0);
const PAN_RIGHT = panOf(1);

const SCALE = (
  <g key="scale">
    <Solid paths={BALANCE_ART.frontCheek} tone="mid" />
    <Line d={BALANCE_ART.scaleMinor} tone="lo" />
    <Line d={BALANCE_ART.scaleMajor} tone="mid" />
    <Line d={BALANCE_ART.scaleZero} tone="hi" />
  </g>
);

const PIN = (
  <g key="pin">
    <Solid paths={BALANCE_ART.pin} tone="mid" />
  </g>
);

const PRINTER_BACK = (
  <g key="printer-back">
    <path className="iso-halo" d={PRINTER_ART.halo} />
    <Solid
      inner={<Line d={PRINTER_ART.bodySeam} tone="faint" />}
      paths={PRINTER_ART.body}
      tone="mid"
    />
    <Line d={PRINTER_ART.vents} tone="lo" />
    <Solid paths={PRINTER_ART.boss} tone="mid" />
    <Solid
      inner={<Line d={PRINTER_ART.coverSeam} tone="faint" />}
      paths={PRINTER_ART.cover}
      tone="mid"
    />
    <Line d={PRINTER_ART.feed} tone="lo" />
    <Dots points={PRINTER_ART.coverScrews} size={0.45} />
    <Solid paths={PRINTER_ART.brackets[0]} tone="mid" />
    <Solid crease="none" paths={PRINTER_ART.cores[0]} tone="mid" />
    <Solid crease="lo" paths={PRINTER_ART.roll} tone="hi" />
  </g>
);

const PRINTER_ROLL_END = (
  <g key="printer-roll-end">
    <Solid crease="none" paths={PRINTER_ART.cores[1]} tone="mid" />
    <Solid paths={PRINTER_ART.brackets[1]} tone="mid" />
    <Solid paths={PRINTER_ART.axle} tone="mid" />
    <g className="iso-solid">
      <path className="iso-fill" d={PRINTER_ART.web} />
      <path className="iso-top" d={PRINTER_ART.web} />
      <path className="iso-line iso-edge" d={PRINTER_ART.web} data-tone="mid" />
    </g>
    <Solid paths={PRINTER_ART.cheeks[0]} tone="mid" />
    <Solid crease="none" paths={PRINTER_ART.platen} tone="mid" />
  </g>
);

const PRINTER_FRONT = (
  <g key="printer-front">
    <Solid paths={PRINTER_ART.cheeks[1]} tone="mid" />
    <Solid crease="lo" paths={PRINTER_ART.knob} tone="mid" />
    <Line d={PRINTER_ART.knobKnurl} tone="lo" />
    <Solid paths={PRINTER_ART.knobHub} tone="mid" />
    {PRINTER_ART.gussets.map((paths, index) => (
      <Solid key={`gusset-${index.toString()}`} paths={paths} tone="mid" />
    ))}
    <Solid paths={PRINTER_ART.lip} tone="mid" />
    <Line d={PRINTER_ART.lipRule} tone="faint" />
  </g>
);

const RAIL = (
  <g key="rail">
    <Solid paths={RAIL_ART.block} tone="mid" />
    <Dots points={RAIL_ART.blockScrews} size={0.5} />
    <Solid paths={RAIL_ART.bumper} tone="lo" />
    {RAIL_ART.beds.map((paths, index) => (
      <Solid key={`bed-${index.toString()}`} paths={paths} tone="lo" />
    ))}
    <Dots points={RAIL_ART.bedScrews} size={0.4} />
    {RAIL_ART.rods.map((paths, index) => (
      <Solid
        crease="none"
        key={`rod-${index.toString()}`}
        paths={paths}
        tone="mid"
      />
    ))}
  </g>
);

const STRIKER = (
  <g key="striker">
    <Solid crease="none" paths={SHUTTLE_ART.striker} tone="hi" />
  </g>
);

const CARRIAGE = (
  <g key="carriage">
    <path className="iso-halo" d={SHUTTLE_ART.halo} />
    {SHUTTLE_ART.bushes.map((paths, index) => (
      <Solid key={`bush-${index.toString()}`} paths={paths} tone="mid" />
    ))}
    <Line d={SHUTTLE_ART.bushRings} tone="lo" />
    <Solid
      inner={<Line d={SHUTTLE_ART.plateSeam} tone="faint" />}
      paths={SHUTTLE_ART.plate}
      tone="mid"
    />
    <Dots points={SHUTTLE_ART.rivets} size={0.4} tone="lo" />
    <Dots points={SHUTTLE_ART.plateScrews} size={0.45} />
  </g>
);

const TOTE_BACK = (
  <g key="tote-back">
    <Solid paths={SHUTTLE_ART.floor} tone="lo" />
    {SHUTTLE_ART.rollers.map((paths, index) => (
      <Solid
        crease="none"
        key={`roller-${index.toString()}`}
        paths={paths}
        tone="mid"
      />
    ))}
    <Solid paths={SHUTTLE_ART.back} tone="mid" />
    <Solid paths={SHUTTLE_ART.end} tone="mid" />
  </g>
);

const TOTE_FRONT = (
  <g key="tote-front">
    <Solid paths={SHUTTLE_ART.front} tone="mid" />
    <Dots points={SHUTTLE_ART.axles} size={0.45} />
  </g>
);

const GATE_LOW = (
  <g key="gate-low">
    <path className="iso-halo" d={GATE_ART.halo} />
    <Solid paths={GATE_ART.pedestal} tone="mid" />
    <Dots points={GATE_ART.pedestalScrews} size={0.5} />
    <Solid paths={GATE_ART.sill} tone="lo" />
    <Solid
      inner={<Line d={GATE_ART.outSeam} tone="faint" />}
      paths={GATE_ART.out}
      tone="mid"
    />
    <Solid paths={GATE_ART.outRails[0]} tone="mid" />
    {GATE_ART.outRollers.map((paths, index) => (
      <Solid
        crease="none"
        key={`out-roller-${index.toString()}`}
        paths={paths}
        tone="mid"
      />
    ))}
    <Solid paths={GATE_ART.outRails[1]} tone="mid" />
    <Dots points={GATE_ART.outAxles} size={0.45} />
    <Solid paths={GATE_ART.outStop} tone="mid" />
  </g>
);

const GATE_BACK = (
  <g key="gate-back">
    <Solid paths={GATE_ART.backPost} tone="mid" />
  </g>
);

const GATE = (
  <g key="gate">
    <Solid lit paths={GATE_ART.gate} tone="hi" />
    <path className="mo-hazard" d={GATE_ART.hazard.stripes} />
    <Line d={GATE_ART.hazard.outline} tone="lit" />
    <Solid lit paths={GATE_ART.gateRib} tone="hi" />
    <Solid lit paths={GATE_ART.gateLug} tone="hi" />
    <Dots points={GATE_ART.gateBolts} size={0.5} tone="hi" />
  </g>
);

const GATE_FRONT = (
  <g key="gate-front">
    <Solid paths={GATE_ART.frontPost} tone="mid" />
    <Line d={GATE_ART.postGroove} tone="lo" />
    <Solid paths={GATE_ART.lintel} tone="mid" />
    <Dots points={GATE_ART.lintelScrews} size={0.5} />
  </g>
);

const QUADRANT = (
  <g key="quadrant">
    <Solid paths={GATE_ART.quadrant} tone="mid" />
    <Dots points={GATE_ART.quadrantPins} size={0.55} tone="hi" />
    <Solid paths={GATE_ART.boss} tone="mid" />
  </g>
);

function stackArt(prefix: string) {
  return STACKS.map((stack, count) =>
    stack ? (
      <g
        data-count={count}
        key={`${prefix}-${count.toString()}`}
        style={{ display: "none" }}
      >
        <Solid
          inner={<Line d={stack.seams} tone="faint" />}
          paths={stack.paths}
          tone="hi"
        />
        <Line d={stack.lines} free tone="lo" />
      </g>
    ) : null
  );
}

const TOTE_STACKS = stackArt("tote");
const SENT_STACKS = stackArt("sent");

const FALLING_SLIP = (
  <g key="falling">
    <Solid paths={FALLING} tone="hi" />
  </g>
);

const LABEL =
  "An illustrative desk machine for the Morning Ops Report. A shuttle runs along a rail past four stations through the night while a clock reads 22:00 to 06:00: a tape deck turns and stacks a card for each call it notes, a balance with the job system's ledgers on one pan and the books on the other settles level when they match, a printer drafts invoice slips onto the shuttle, and the shuttle parks the slips behind a gate. The gate only opens when the owner presses the lever beside it.";

export function MorningOpsArt() {
  return (
    <MorningOpsLive
      arrest={ARREST}
      balBack={BAL_BACK}
      balCap={BAL_CAP}
      balMid={BAL_MID}
      base={BASE}
      carriage={CARRIAGE}
      clock={CLOCK}
      clockHub={CLOCK_HUB}
      deckBack={DECK_BACK}
      deckCap={DECK_CAP}
      deckFront={DECK_FRONT}
      deckHubs={DECK_HUBS}
      deckKeys={DECK_KEYS}
      falling={FALLING_SLIP}
      gate={GATE}
      gateBack={GATE_BACK}
      gateFront={GATE_FRONT}
      gateLow={GATE_LOW}
      label={LABEL}
      panLeft={PAN_LEFT}
      panRight={PAN_RIGHT}
      pin={PIN}
      playKey={PLAY_KEY}
      printerBack={PRINTER_BACK}
      printerCap={PRINTER_CAP}
      printerFront={PRINTER_FRONT}
      printerRollEnd={PRINTER_ROLL_END}
      quadrant={QUADRANT}
      rail={RAIL}
      report={REPORT}
      reportTicks={REPORT_TICKS}
      scale={SCALE}
      sentStacks={SENT_STACKS}
      striker={STRIKER}
      toteBack={TOTE_BACK}
      toteFront={TOTE_FRONT}
      toteStacks={TOTE_STACKS}
      trayBack={TRAY_BACK}
      trayFront={TRAY_FRONT}
    />
  );
}
