import { space } from "@webbraces/design-system";

/**
 * Tower geometry for video 001, in frame px.
 *
 * This lives in one file because three scenes draw the same two towers (the aha at 1:05, the
 * diagnosis at 3:20, the lesson at 4:12) and the viewer is meant to recognise them as the same
 * picture. If `Contexts` and `TheLesson` each carried their own numbers, they would drift by a
 * few px and the lesson would read as a *new* diagram rather than a familiar one.
 */
export const TOWER = {
  width: 440,
  layerHeight: 80,
  gap: space[3],
  /** One slot of vertical travel. */
  step: 80 + space[3],
} as const;

/**
 * The load-bearing invariant of the whole video:
 *
 *   B.bottom  >  A.bottom + (A slots × step)
 *
 * Tower B's floor must sit above tower A's ceiling. That gap is what makes it possible for a
 * gold element to top tower A and still be underneath where tower B *begins* — which is the
 * "aha" the brief names, and the reason anyone watches to 1:05. Change these numbers and check
 * the frame at 1:20 before believing anything still works.
 */
export const CONTEXTS = {
  /** Both towers start here, stacked into one column — that is the flat model at 0:20. */
  merged: { left: 740, bottom: 280 },
  /** The trapped world: three layers, low. */
  a: { left: 380, bottom: 240, slots: 3 },
  /** The world above it: two layers, and a floor higher than A's ceiling. */
  b: { left: 1100, bottom: 660, slots: 2 },
} as const;

/** Where the dashed "still below this" arrow starts and lands. */
export const AHA = {
  /** Top edge of `.modal` once it has pressed as high as z-index can take it (slot 2.12). */
  from: {
    x: CONTEXTS.a.left + TOWER.width + space[2],
    y: 1080 - (CONTEXTS.a.bottom + 2.12 * TOWER.step + TOWER.layerHeight),
  },
  /** Tower B's base line. */
  to: { x: CONTEXTS.b.left - space[4], y: 1080 - (CONTEXTS.b.bottom - space[2]) },
} as const;
