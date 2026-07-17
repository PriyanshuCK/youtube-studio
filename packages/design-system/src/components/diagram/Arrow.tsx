import React, { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useTiming } from "../../motion/timing";
import { useTheme } from "../../theme/Theme";

export type Point = { x: number; y: number };

export type ArrowProps = {
  from: Point;
  to: Point;
  /**
   * Bow of the arc, in px perpendicular to the line. Natural movement follows curved paths —
   * a straight arrow is the exception, not the default.
   */
  bow?: number;
  /** ms — when the arrow draws itself. */
  at?: number;
  /** ms. */
  duration?: number;
  color?: string;
  label?: string;
  /** Dashed for "could, but doesn't" relationships. */
  dashed?: boolean;
};

const HEAD = 14;

/**
 * Arrows lead the eye along the logical flow of the explanation (Gestalt continuity, design
 * doc §C). They draw on rather than appear, so the eye travels the path in the direction the
 * explanation is going.
 *
 * Coordinates are in composition px — place it in an `<AbsoluteFill>` over the scene.
 */
export const Arrow: React.FC<ArrowProps> = ({
  from,
  to,
  bow = 0,
  at = 0,
  duration,
  color,
  label,
  dashed = false,
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { ms } = useTiming();

  const stroke = color ?? theme.color.accent.focus;
  const span = duration ?? theme.duration.move;

  const { path, mid, headAngle } = useMemo(() => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy) || 1;
    // Control point pushed perpendicular to the chord gives the arc its bow.
    const control = {
      x: (from.x + to.x) / 2 - (dy / length) * bow,
      y: (from.y + to.y) / 2 + (dx / length) * bow,
    };
    return {
      path: `M ${from.x} ${from.y} Q ${control.x} ${control.y} ${to.x} ${to.y}`,
      mid: {
        x: 0.25 * from.x + 0.5 * control.x + 0.25 * to.x,
        y: 0.25 * from.y + 0.5 * control.y + 0.25 * to.y,
      },
      // The head must point along the tangent at the end, not along the chord.
      headAngle: (Math.atan2(to.y - control.y, to.x - control.x) * 180) / Math.PI,
    };
  }, [from, to, bow]);

  const draw = interpolate(frame, [ms(at), ms(at + span)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.inout,
  });

  const headOpacity = interpolate(draw, [0.85, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      viewBox={`0 0 ${theme.layout.frame.width} ${theme.layout.frame.height}`}
      width={theme.layout.frame.width}
      height={theme.layout.frame.height}
      style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
    >
      {/*
        pathLength={1} normalises the dash maths, so one draw implementation works at any length.
        A dashed arrow can't also use the dash array to draw itself, so it fades instead.
      */}
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth={theme.stroke.regular}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={dashed ? "0.02 0.02" : 1}
        strokeDashoffset={dashed ? 0 : 1 - draw}
        opacity={dashed ? draw : 1}
      />
      <polygon
        points={`0,0 ${-HEAD},${HEAD / 2.2} ${-HEAD},${-HEAD / 2.2}`}
        fill={stroke}
        opacity={headOpacity}
        transform={`translate(${to.x} ${to.y}) rotate(${headAngle})`}
      />
      {label ? (
        <text
          x={mid.x}
          y={mid.y - theme.space[4]}
          fill={theme.color.text.muted}
          opacity={headOpacity}
          textAnchor="middle"
          style={{ ...theme.text.caption, fontSize: theme.size.caption }}
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
};
