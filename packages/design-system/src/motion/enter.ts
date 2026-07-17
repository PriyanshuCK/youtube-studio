import { interpolate, useCurrentFrame } from "remotion";
import { duration as durationToken, enterFrom, stagger } from "../tokens/motion";
import { ease } from "./easing";
import { useTiming } from "./timing";

type EasingFn = (input: number) => number;

export type EnterOptions = {
  /** Milliseconds after the sequence starts. Use `stagger` tokens for lists. */
  delay?: number;
  /** Milliseconds. Use a `duration` token. */
  duration?: number;
  easing?: EasingFn;
  /** Never 0 — the house rule is enter from 0.95. */
  scaleFrom?: number;
  /** Direction the element arrives from, when arriving from somewhere is the point. */
  from?: "none" | "left" | "right" | "top" | "bottom";
  /** Travel distance in px for a directional entrance. */
  distance?: number;
};

export type Entrance = {
  /** 0→1 eased progress, for driving anything else on the same beat. */
  progress: number;
  opacity: number;
  scale: number;
  /** CSS `translate` shorthand, e.g. `"0px 16px"`. */
  translate: string;
};

const offsetFor = (from: NonNullable<EnterOptions["from"]>, d: number) => {
  switch (from) {
    case "left":
      return [-d, 0];
    case "right":
      return [d, 0];
    case "top":
      return [0, -d];
    case "bottom":
      return [0, d];
    default:
      return [0, 0];
  }
};

/**
 * The house entrance, in one hook: opacity 0→1 and scale 0.95→1 on `ease/out`.
 *
 * Enforces two rules from the design doc so no component re-derives them:
 * nothing appears from nothing (never `scale(0)`), and entrances never use `ease-in`.
 */
export const useEnter = (options: EnterOptions = {}): Entrance => {
  const frame = useCurrentFrame();
  const { ms } = useTiming();

  const {
    delay = 0,
    duration = durationToken.base,
    easing = ease.out,
    scaleFrom = enterFrom.scale,
    from = "none",
    distance = enterFrom.offset,
  } = options;

  if (scaleFrom === 0) {
    throw new Error(
      "useEnter: nothing animates from scale(0) — enter from scale(0.95) + opacity.",
    );
  }

  const progress = interpolate(frame, [ms(delay), ms(delay + duration)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

  const [dx, dy] = offsetFor(from, distance);

  return {
    progress,
    opacity: interpolate(progress, [0, 1], [enterFrom.opacity, 1]),
    scale: interpolate(progress, [0, 1], [scaleFrom, 1]),
    translate: `${interpolate(progress, [0, 1], [dx ?? 0, 0])}px ${interpolate(
      progress,
      [0, 1],
      [dy ?? 0, 0],
    )}px`,
  };
};

/**
 * Staggered entrance for the nth item in a list or diagram.
 * 60–120ms apart sets reading order; the eye learns what to read first.
 */
export const useStaggeredEnter = (
  index: number,
  options: EnterOptions & { step?: number } = {},
): Entrance => {
  const { step = stagger.base, delay = 0, ...rest } = options;
  return useEnter({ ...rest, delay: delay + index * step });
};
