import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useEnter } from "../motion/enter";
import { useTiming } from "../motion/timing";
import { useTheme } from "../theme/Theme";

/** A real text caret blinks on a ~530ms half-period. Borrowed so it reads as a text editor. */
const BLINK_HALF_PERIOD_MS = 530;

export type CaretProps = {
  /** Bar height in px. Defaults to the body size, so it sits with a line of text. */
  height?: number;
  /** ms. */
  delay?: number;
  /** At rest the caret blinks. Turn off while it is moving or doing work. */
  blink?: boolean;
  color?: string;
  /**
   * Morph the caret into an underline of this width (px) — the pointer doing the underlining
   * itself, rather than a rule appearing from nowhere. Pair with `underlineAt`.
   */
  underlineWidth?: number;
  /** ms — when the underline is drawn. */
  underlineAt?: number;
};

/**
 * The channel's pointer motif (design doc §5): a gold text caret that leads the eye, blinks at
 * rest, and can draw an underline under the word being said. A cheaper, more intimate laser
 * pointer — and on-brand for a text-editor channel.
 */
export const Caret: React.FC<CaretProps> = ({
  height,
  delay = 0,
  blink = true,
  color,
  underlineWidth,
  underlineAt,
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { ms } = useTiming();

  const barHeight = height ?? theme.size.body;
  const entrance = useEnter({ delay, duration: theme.duration.quick });

  const underlining = underlineWidth !== undefined && underlineAt !== undefined;

  // The bar rolls over into a rule: width grows, height collapses to a stroke. One object,
  // two states — the viewer follows the transformation instead of seeing a cut.
  const morph = underlining
    ? interpolate(frame, [ms(underlineAt), ms(underlineAt + theme.duration.move)], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: theme.ease.inout,
      })
    : 0;

  // Blinking is mechanical, so it is one of the few things allowed a hard, unversed cadence.
  const phase = frame % ms(BLINK_HALF_PERIOD_MS * 2);
  const atRest = blink && morph === 0;
  const blinkOpacity = atRest && phase >= ms(BLINK_HALF_PERIOD_MS) ? 0 : 1;

  return (
    <span
      style={{
        display: "inline-block",
        width: interpolate(morph, [0, 1], [theme.stroke.emphasis, underlineWidth ?? 0]),
        height: interpolate(morph, [0, 1], [barHeight, theme.stroke.emphasis]),
        borderRadius: theme.stroke.hairline,
        backgroundColor: color ?? theme.color.accent.brand,
        boxShadow: `0 0 ${theme.space[2]}px ${theme.alpha.brand(0.35)}`,
        opacity: entrance.opacity * blinkOpacity,
        // A caret sits on the text baseline, not the middle of the line box.
        verticalAlign: morph > 0.5 ? "baseline" : "middle",
        flexShrink: 0,
      }}
    />
  );
};
