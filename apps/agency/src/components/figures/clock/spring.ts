// The balance's hairspring: an Archimedean spiral from the collet on the
// balance staff to the stud. The inner end turns with the balance and the
// outer end stays put, so the coils breathe as it swings.

const TURNS = 7;
export const SPRING_INNER = 3.2;
export const SPRING_OUTER = 15.5;
const STEPS = TURNS * 30;
const TAU = Math.PI * 2;

const round = (value: number) => Math.round(value * 10) / 10;

export function hairspring(turn: number) {
  let d = "";
  for (let index = 0; index <= STEPS; index += 1) {
    const t = index / STEPS;
    const th = t * TURNS * TAU + (1 - t) * turn;
    const r = SPRING_INNER + (SPRING_OUTER - SPRING_INNER) * t;
    d += `${index === 0 ? "M" : "L"}${round(r * Math.cos(th))} ${round(r * Math.sin(th))}`;
  }
  return d;
}
