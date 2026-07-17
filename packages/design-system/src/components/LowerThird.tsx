import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useEnter } from "../motion/enter";
import { useTiming } from "../motion/timing";
import { useTheme } from "../theme/Theme";

export type LowerThirdProps = {
  label: string;
  sublabel?: string;
  /** ms. */
  delay?: number;
  /** ms — when it leaves. Omit to leave it on screen for the whole sequence. */
  exitAt?: number;
  align?: "left" | "right";
};

/**
 * Consistent labels / name tags (design doc §6). Sits inside the safe margin, anchored to the
 * lower third, with the gold rule marking it as ours. Secondary by construction — it names the
 * thing on screen, it never competes with it.
 */
export const LowerThird: React.FC<LowerThirdProps> = ({
  label,
  sublabel,
  delay = 0,
  exitAt,
  align = "left",
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { ms } = useTiming();

  const entrance = useEnter({
    delay,
    duration: theme.duration.base,
    easing: theme.ease.soft,
    from: align === "left" ? "left" : "right",
    distance: theme.space[4],
  });

  const exit =
    exitAt === undefined
      ? 1
      : interpolate(frame, [ms(exitAt), ms(exitAt + theme.duration.quick)], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: theme.ease.inout,
        });

  return (
    <div
      style={{
        position: "absolute",
        left: align === "left" ? theme.layout.safeMargin : undefined,
        right: align === "right" ? theme.layout.safeMargin : undefined,
        bottom: theme.layout.safeMargin,
        display: "flex",
        alignItems: "center",
        gap: theme.space[3],
        opacity: entrance.opacity * exit,
        scale: entrance.scale,
        translate: entrance.translate,
      }}
    >
      <div
        style={{
          width: theme.stroke.emphasis,
          alignSelf: "stretch",
          borderRadius: theme.stroke.hairline,
          backgroundColor: theme.color.accent.brand,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.space[1] / 2,
          padding: `${theme.space[2]}px ${theme.space[3]}px`,
          borderRadius: theme.radius.panel,
          backgroundColor: theme.alpha.panel(0.85),
        }}
      >
        <span style={{ ...theme.text.bodyMedium, color: theme.color.text.primary }}>
          {label}
        </span>
        {sublabel ? (
          <span style={{ ...theme.text.caption, color: theme.color.text.muted }}>
            {sublabel}
          </span>
        ) : null}
      </div>
    </div>
  );
};
