import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useTiming } from "../../motion/timing";
import { useTheme } from "../../theme/Theme";

export type MorphState = {
  x?: number;
  y?: number;
  scale?: number;
  opacity?: number;
  rotate?: number;
};

export type MorphProps = {
  children: React.ReactNode;
  from: MorphState;
  to: MorphState;
  /** ms — when the transformation happens. Sync this to the narration beat that explains it. */
  at: number;
  /** ms. Defaults to `dur/move`; use `dur/scene` for a big conceptual transformation. */
  duration?: number;
  /** Defaults to `ease/inout` — the on-screen-move curve. */
  easing?: (input: number) => number;
};

const DEFAULTS: Required<MorphState> = { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 };

/**
 * Morph one state into another rather than cut (design doc §4, rule 4), so the viewer follows
 * the transformation instead of being handed a new picture and asked to diff it against memory.
 *
 * This is the component behind "the single tower splits into two" — same objects, moved, so the
 * viewer knows the two towers *are* the one tower.
 */
export const Morph: React.FC<MorphProps> = ({
  children,
  from,
  to,
  at,
  duration,
  easing,
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { ms } = useTiming();

  const start = { ...DEFAULTS, ...from };
  const end = { ...DEFAULTS, ...to };

  if (start.scale === 0 || end.scale === 0) {
    throw new Error("Morph: nothing animates from or to scale(0) — fade and hold at 0.95.");
  }

  const progress = interpolate(
    frame,
    [ms(at), ms(at + (duration ?? theme.duration.move))],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easing ?? theme.ease.inout,
    },
  );

  const lerp = (a: number, b: number) => interpolate(progress, [0, 1], [a, b]);

  return (
    <div
      style={{
        translate: `${lerp(start.x, end.x)}px ${lerp(start.y, end.y)}px`,
        scale: lerp(start.scale, end.scale),
        rotate: `${lerp(start.rotate, end.rotate)}deg`,
        opacity: lerp(start.opacity, end.opacity),
      }}
    >
      {children}
    </div>
  );
};
