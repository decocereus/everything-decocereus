// The clock's movement, as numbers. Everything that turns reads its rate from here.
//
// Rates are degrees per beat, seen from the dial side, clockwise positive.
// One beat is one swing of the balance; the escape wheel lets half a tooth
// through on each beat. Each rate follows from the tooth counts of the pair
// that meshes, so the ratios on screen are the real ones.

export const BEAT = 1.1;

export const TEETH = {
  barrel: 60,
  cannonPinion: 10,
  centerPinion: 10,
  centerWheel: 36,
  escapePinion: 8,
  escapeWheel: 15,
  hourWheel: 32,
  minutePinion: 8,
  minuteWheel: 30,
  thirdPinion: 12,
  thirdWheel: 32,
} as const;

const escapeStep = 360 / TEETH.escapeWheel / 2;
const third = -(escapeStep * TEETH.escapePinion) / TEETH.thirdWheel;
const center = -(third * TEETH.thirdPinion) / TEETH.centerWheel;
const minuteWheel = -(center * TEETH.cannonPinion) / TEETH.minuteWheel;
const hourWheel = -(minuteWheel * TEETH.minutePinion) / TEETH.hourWheel;
const barrel = -(center * TEETH.centerPinion) / TEETH.barrel;

export const RATES = {
  barrel,
  center,
  escape: escapeStep,
  hour: hourWheel,
  hourWheel,
  minute: center,
  minuteWheel,
  third,
} as const;

export type Spin = keyof typeof RATES | "balance" | "fork";

// Where the hands start, in degrees from twelve: 1:22, both hands clear of
// the bezel and over the dial.
export const HANDS = { hour: 41, minute: 132 } as const;

export const SWING = 110;
export const FORK = 9;
export const TICK = 0.2;
