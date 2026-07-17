import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useEnter } from "../motion/enter";
import { useTiming } from "../motion/timing";
import { useTheme } from "../theme/Theme";

export type StepItem = {
  content: React.ReactNode;
  /**
   * ms — the instant the narration names this item. Overrides the uniform stagger.
   * Animation is blocked to the voiceover first, then eased; this is where that happens.
   */
  at?: number;
};

export type StepRevealProps = {
  items: (StepItem | React.ReactNode)[];
  /** ms — when the first item lands. */
  delay?: number;
  /** ms between items when they aren't individually timed. 60–120ms sets reading order. */
  step?: number;
  gap?: number;
  /**
   * Dim already-revealed items so the newest is the only focal point.
   * One focal point per frame — the whole design doc §B in one prop.
   */
  focusLatest?: boolean;
  /** Opacity of superseded items when `focusLatest`. */
  dim?: number;
};

const isStepItem = (item: StepItem | React.ReactNode): item is StepItem =>
  typeof item === "object" && item !== null && "content" in item;

/**
 * Staggered list / diagram reveal (design doc §6). Complexity is revealed sequentially,
 * never dumped: the viewer should never see a finished-but-unexplained list.
 */
export const StepReveal: React.FC<StepRevealProps> = ({
  items,
  delay = 0,
  step,
  gap,
  focusLatest = false,
  dim = 0.4,
}) => {
  const theme = useTheme();
  const spacing = step ?? theme.stagger.loose;

  const timings = items.map((item, index) =>
    isStepItem(item) && item.at !== undefined ? item.at : delay + index * spacing,
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: gap ?? theme.space[3],
        alignItems: "flex-start",
      }}
    >
      {items.map((item, index) => (
        <Step
          key={index}
          at={timings[index] as number}
          // An item stops being the focus once the next one is named.
          supersededAt={focusLatest ? timings[index + 1] : undefined}
          dim={dim}
        >
          {isStepItem(item) ? item.content : item}
        </Step>
      ))}
    </div>
  );
};

const Step: React.FC<{
  children: React.ReactNode;
  at: number;
  supersededAt: number | undefined;
  dim: number;
}> = ({ children, at, supersededAt, dim }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { ms } = useTiming();

  const entrance = useEnter({
    delay: at,
    duration: theme.duration.base,
    easing: theme.ease.soft,
    from: "left",
    distance: theme.space[3],
  });

  const focus =
    supersededAt === undefined
      ? 1
      : interpolate(frame, [ms(supersededAt), ms(supersededAt + theme.duration.base)], [1, dim], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: theme.ease.inout,
        });

  return (
    <div
      style={{
        opacity: entrance.opacity * focus,
        scale: entrance.scale,
        translate: entrance.translate,
      }}
    >
      {children}
    </div>
  );
};
