/**
 * Motion tokens — mirrors `docs/brand/WebBraces-Design-System.md` §4.
 *
 * Rules these encode:
 *  - Nothing moves at constant velocity except deliberate constant motion (`linear`).
 *  - Never `ease-in` for entrances — sluggish at the exact moment the viewer is watching.
 *  - Nothing appears from nothing: enter from scale(0.95) + opacity 0, never scale(0).
 *
 * Raw curve data only. `../motion/easing.ts` turns these into Remotion `Easing` functions.
 */

export type Bezier = readonly [number, number, number, number];

export const curve = {
  /** `ease/out` — entrances (decisive stop). */
  out: [0.23, 1, 0.32, 1] as Bezier,
  /** `ease/inout` — on-screen morphs / moves. */
  inout: [0.77, 0, 0.175, 1] as Bezier,
  /** `ease/soft` — gentle, elegant reveals. */
  soft: [0.32, 0.72, 0, 1] as Bezier,
} as const;

/** Milliseconds. Video timing — longer than UI. Tie these to narration beats, not counts. */
export const duration = {
  /** `dur/quick` — label pops, small emphasis. */
  quick: 250,
  /** `dur/base` — standard element reveal. */
  base: 450,
  /** `dur/move` — morphs, repositioning. */
  move: 650,
  /** `dur/scene` — big conceptual transformations. */
  scene: 900,
} as const;

/**
 * Stagger to set reading order — reveal elements 60–120ms apart so the eye knows what's first.
 */
export const stagger = {
  tight: 60,
  base: 90,
  loose: 120,
} as const;

/** The house entrance: never scale(0). */
export const enterFrom = {
  scale: 0.95,
  opacity: 0,
  /** Small directional offset for entrances that should read as arriving from somewhere. */
  offset: 16,
} as const;

export type Motion = {
  curve: typeof curve;
  duration: typeof duration;
  stagger: typeof stagger;
  enterFrom: typeof enterFrom;
};
