import "../../iso/iso.css";
import "./morning-ops.css";
import { Plate } from "../../iso/react/draw.tsx";
import { MorningOpsArt } from "./art.tsx";
import { CAPTION, MORNING, readoutOf } from "./model.ts";

export function MorningOpsFigure() {
  return (
    <div className="iso" data-theme="light">
      <Plate
        caption={CAPTION}
        fig="Fig 1"
        hint="Scrub the night · press the lever"
        keys={[
          {
            label: "The gate and its lever: the owner's approval",
            mark: "lit",
          },
          { label: "Work done overnight", mark: "raised" },
        ]}
        readout={readoutOf(MORNING)}
        title="Morning Ops Report"
      >
        <MorningOpsArt />
      </Plate>
    </div>
  );
}
