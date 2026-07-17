import { Easing } from "remotion";
import { curve } from "../tokens/motion";

/**
 * The only easings allowed on screen. Importing `Easing.bezier` directly in a scene, or
 * leaving `interpolate` on its default linear ramp, is what this exists to prevent.
 */
export const ease = {
  /** Entrances (decisive stop). Never `ease-in` for these. */
  out: Easing.bezier(...curve.out),
  /** On-screen morphs / moves. */
  inout: Easing.bezier(...curve.inout),
  /** Gentle, elegant reveals. */
  soft: Easing.bezier(...curve.soft),
  /**
   * Constant motion ONLY — a progress bar, a scan line sweeping a line of code, a caret blink.
   * If it is an entrance or a move, it is a bug.
   */
  linear: Easing.linear,
} as const;

export type EaseToken = keyof typeof ease;
