import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useTiming } from "../motion/timing";
import { useTheme } from "../theme/Theme";
import { useCodeGeometry } from "./code/CodeBlockContext";

export type LineHighlightProps = {
  /** 1-based line number, matching what the viewer would count. */
  line: number;
  /** How many lines to bracket. */
  span?: number;
  /** ms. */
  at?: number;
  /**
   * `brace` is the signature: a gold brace bracketing the line that matters.
   * `glow` is the quieter band, for when a brace would be too loud (e.g. two lines at once).
   */
  variant?: "brace" | "glow";
  /** Defaults to `accent/brand`. Pass `state/bad` or `state/good` when the line is the verdict. */
  color?: string;
};

/**
 * Emphasis on specific code lines (design doc §5): "a single gold brace can bracket one line of
 * code to say *this is the part that matters*."
 *
 * Renders inside a `<CodeBlock>`, which publishes its line geometry — so the brace lands on the
 * line exactly, with no DOM measuring.
 */
export const LineHighlight: React.FC<LineHighlightProps> = ({
  line,
  span = 1,
  at = 0,
  variant = "brace",
  color,
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { ms } = useTiming();
  const geometry = useCodeGeometry();

  const accent = color ?? theme.color.accent.brand;
  const top = (line - 1) * geometry.lineHeight;
  const height = span * geometry.lineHeight;

  const progress = interpolate(frame, [ms(at), ms(at + theme.duration.base)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.out,
  });

  return (
    <>
      {/* The band is a wipe, not a scale — it reads as light falling across the line. */}
      <div
        style={{
          position: "absolute",
          top,
          left: -theme.space[2],
          height,
          right: -theme.space[2],
          borderRadius: theme.radius.box,
          backgroundColor:
            color === undefined ? theme.alpha.brand(0.1) : theme.alpha.focus(0.1),
          opacity: progress,
          clipPath: `inset(0 ${interpolate(progress, [0, 1], [100, 0])}% 0 0)`,
          pointerEvents: "none",
        }}
      />
      {variant === "brace" ? (
        <span
          style={{
            position: "absolute",
            top,
            left: -(geometry.gutter + theme.space[3]),
            height,
            display: "flex",
            alignItems: "center",
            fontFamily: theme.font.mono,
            fontWeight: theme.weight.codeBold,
            fontSize: geometry.fontSize * (0.9 + span * 0.55),
            color: accent,
            opacity: progress,
            translate: `${interpolate(progress, [0, 1], [-theme.space[2], 0])}px 0px`,
          }}
        >
          {"{"}
        </span>
      ) : (
        <div
          style={{
            position: "absolute",
            top,
            left: -(geometry.gutter + theme.space[2]),
            height,
            width: theme.stroke.emphasis,
            borderRadius: theme.stroke.hairline,
            backgroundColor: accent,
            opacity: progress,
            // Drawn top-to-bottom (a wipe), so the rule is never a zero-scaled object.
            clipPath: `inset(0 0 ${interpolate(progress, [0, 1], [100, 0])}% 0)`,
          }}
        />
      )}
    </>
  );
};
