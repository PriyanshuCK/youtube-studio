import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useEnter } from "../motion/enter";
import { useTiming } from "../motion/timing";
import { useTheme } from "../theme/Theme";

export type BraceFrameProps = {
  children: React.ReactNode;
  /** ms — when the braces begin sweeping in. */
  delay?: number;
  /** ms — the sweep itself. */
  duration?: number;
  /** ms — when the braces open outward again. Omit to leave them closed. */
  openAt?: number;
  /** ms. */
  openDuration?: number;
  /** How far each brace travels when opening, in px. */
  openDistance?: number;
  /** ms — when the content appears. Defaults to mid-sweep, so the braces land *around* it. */
  revealAt?: number;
  /** Brace glyph size in px. */
  braceSize?: number;
  /** Gap between each brace and the content. */
  gap?: number;
  /** Fades the content out as the braces open (an Intro wants this; an emphasis brace doesn't). */
  fadeOnOpen?: boolean;
};

/**
 * The channel signature (design doc §5): two gold braces sweep in and close around a concept,
 * then open outward to reveal it. Braces are the boundary between "the thing" and "what's
 * inside it" — so closing them frames the idea, and opening them is the reveal.
 *
 * Motion: a beat of anticipation (each brace pulls back before it sweeps) on `ease/out` for the
 * close, `ease/inout` for the open. This is the one place the channel spends its boldness;
 * everything around it stays quiet so it reads.
 */
export const BraceFrame: React.FC<BraceFrameProps> = ({
  children,
  delay = 0,
  duration,
  openAt,
  openDuration,
  openDistance = 220,
  revealAt,
  braceSize,
  gap,
  fadeOnOpen = false,
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { ms } = useTiming();

  const sweep = duration ?? theme.duration.scene;
  const openSpan = openDuration ?? theme.duration.move;
  const glyph = braceSize ?? theme.size.display * 1.4;
  const inset = gap ?? theme.space[5];

  // Off-frame start, plus a short wind-up so the viewer's eye is ready for the sweep.
  const travel = theme.layout.frame.width / 2;
  const windUp = theme.space[5];

  const sweepIn = (direction: -1 | 1) =>
    interpolate(
      frame,
      [ms(delay), ms(delay + theme.duration.quick / 2), ms(delay + sweep)],
      [direction * travel, direction * (travel + windUp), 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: theme.ease.out,
      },
    );

  const open = (direction: -1 | 1) =>
    openAt === undefined
      ? 0
      : interpolate(frame, [ms(openAt), ms(openAt + openSpan)], [0, direction * openDistance], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: theme.ease.inout,
        });

  const content = useEnter({
    delay: revealAt ?? delay + sweep * 0.55,
    duration: theme.duration.base,
    easing: theme.ease.soft,
  });

  const contentFade =
    fadeOnOpen && openAt !== undefined
      ? interpolate(frame, [ms(openAt), ms(openAt + openSpan * 0.7)], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: theme.ease.inout,
        })
      : 1;

  const brace = (char: "{" | "}", direction: -1 | 1): React.ReactNode => (
    <span
      style={{
        fontFamily: theme.font.mono,
        fontWeight: theme.weight.codeBold,
        fontSize: glyph,
        lineHeight: theme.lineHeight.tight,
        color: theme.color.accent.brand,
        textShadow: `0 0 ${theme.space[5]}px ${theme.alpha.brand(0.25)}`,
        translate: `${sweepIn(direction) + open(direction)}px 0px`,
        // Braces are decorative geometry — they must not add layout width when they move.
        flexShrink: 0,
      }}
    >
      {char}
    </span>
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: inset,
      }}
    >
      {brace("{", -1)}
      <div
        style={{
          opacity: content.opacity * contentFade,
          scale: content.scale,
        }}
      >
        {children}
      </div>
      {brace("}", 1)}
    </div>
  );
};
