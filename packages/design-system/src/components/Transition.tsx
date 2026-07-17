import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTiming } from "../motion/timing";
import { useTheme } from "../theme/Theme";

export type TransitionVariant = "softPush" | "braceWipe" | "fade";

export type TransitionProps = {
  children: React.ReactNode;
  /**
   * `softPush` — the default scene change: content eases in and out with a small travel.
   * `braceWipe` — the signature act break: a giant gold brace sweeps the frame and takes the
   *   scene with it. Reserve it for act boundaries; used often it stops being a signature.
   * `fade` — for when a move would imply a relationship that isn't there.
   */
  variant?: TransitionVariant;
  /** ms — when the scene arrives. */
  enterAt?: number;
  /** ms — when the scene leaves. Omit if the sequence simply ends. */
  exitAt?: number;
  /** Travel direction for `softPush`. */
  direction?: "left" | "right";
};

/**
 * Standard scene-to-scene (design doc §6). Cuts are the exception: motion tracks meaning, and a
 * push tells the viewer the next idea follows from this one.
 */
export const Transition: React.FC<TransitionProps> = ({
  children,
  variant = "softPush",
  enterAt = 0,
  exitAt,
  direction = "left",
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { ms } = useTiming();

  const span = theme.duration.move;
  const travel = variant === "softPush" ? theme.space[8] : 0;
  const sign = direction === "left" ? -1 : 1;

  const enter = interpolate(frame, [ms(enterAt), ms(enterAt + span)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.out,
  });

  const exit =
    exitAt === undefined
      ? 0
      : interpolate(frame, [ms(exitAt), ms(exitAt + span)], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: theme.ease.inout,
        });

  // The brace crossing the middle of the frame is what hides the swap.
  const wipe =
    variant === "braceWipe" && exitAt !== undefined
      ? interpolate(frame, [ms(exitAt), ms(exitAt + theme.duration.scene)], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: theme.ease.inout,
        })
      : 0;

  const opacity =
    variant === "braceWipe"
      ? enter * (1 - interpolate(wipe, [0.35, 0.55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))
      : enter * (1 - exit);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity,
          translate:
            variant === "softPush"
              ? `${
                  interpolate(enter, [0, 1], [-sign * travel, 0]) +
                  interpolate(exit, [0, 1], [0, sign * travel])
                }px 0px`
              : undefined,
        }}
      >
        {children}
      </AbsoluteFill>

      {variant === "braceWipe" && exitAt !== undefined ? (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: theme.font.mono,
              fontWeight: theme.weight.codeBold,
              fontSize: theme.layout.frame.height,
              lineHeight: 1,
              color: theme.color.accent.brand,
              opacity: interpolate(wipe, [0, 0.15, 0.85, 1], [0, 1, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: `${interpolate(
                wipe,
                [0, 1],
                [-theme.layout.frame.width * 0.75, theme.layout.frame.width * 0.75],
              )}px 0px`,
            }}
          >
            {"}"}
          </span>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
