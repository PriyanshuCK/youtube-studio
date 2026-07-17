import { useEnter, useTiming, useTheme } from "@webbraces/design-system";
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export type ZStep = {
  /** ms. */
  at: number;
  value: string;
};

export type ZBadgeProps = {
  /** The value swaps at each step. The first step is when the badge arrives. */
  steps: ZStep[];
  /** ms — when a coral ✕ flicks over the badge. */
  struckAt?: number;
  size?: number;
};

/**
 * The `z-index: N` stamp, and the number that keeps going up while nothing happens.
 *
 * The badge is the hook's whole joke: the value changes, the picture doesn't. Each swap gets a
 * small pop so the eye catches that the number *did* change — otherwise the viewer reads the
 * still frame as "nothing is happening" rather than "I tried, and nothing happened".
 */
export const ZBadge: React.FC<ZBadgeProps> = ({ steps, struckAt, size }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { ms } = useTiming();

  const first = steps[0];
  if (!first) throw new Error("ZBadge needs at least one step.");

  const entrance = useEnter({ delay: first.at, duration: theme.duration.quick });

  // The last step whose beat has passed.
  const active = steps.reduce((current, step) => (frame >= ms(step.at) ? step : current), first);

  // Each swap pops from 0.95 — never from nothing.
  const pop = interpolate(
    frame,
    [ms(active.at), ms(active.at + theme.duration.quick)],
    [theme.enterFrom.scale, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.out },
  );

  const strike =
    struckAt === undefined
      ? 0
      : interpolate(frame, [ms(struckAt), ms(struckAt + theme.duration.quick)], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: theme.ease.out,
        });

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        padding: `${theme.space[2]}px ${theme.space[4]}px`,
        borderRadius: theme.radius.pill,
        backgroundColor: theme.alpha.brand(0.12),
        border: `${theme.hairline}px solid ${theme.alpha.brand(0.4)}`,
        opacity: entrance.opacity,
        scale: pop,
      }}
    >
      <span
        style={{
          ...theme.text.code,
          fontSize: size ?? theme.size.h2,
          color: theme.color.accent.brand,
          whiteSpace: "pre",
        }}
      >
        z-index: {active.value}
      </span>

      {struckAt !== undefined ? (
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // Big enough to cross out the whole stamp. At 2× it lands on one letter and reads
            // as a typo rather than a verdict.
            fontSize: (size ?? theme.size.h2) * 3.2,
            lineHeight: 1,
            color: theme.color.state.bad,
            opacity: strike * 0.9,
            // The flick: it arrives off-angle and settles, like it was struck through by hand.
            rotate: `${interpolate(strike, [0, 1], [-14, -6])}deg`,
            scale: interpolate(strike, [0, 1], [1.25, 1]),
          }}
        >
          ✕
        </span>
      ) : null}
    </div>
  );
};
