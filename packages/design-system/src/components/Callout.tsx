import React from "react";
import { useEnter } from "../motion/enter";
import { useTheme } from "../theme/Theme";

export type CalloutProps = {
  children: React.ReactNode;
  /** `bad` = the anti-pattern / before. `good` = the correct pattern / after. */
  variant: "bad" | "good";
  /** ms. */
  delay?: number;
  /** Direction it arrives from, when it should read as arriving rather than appearing. */
  from?: "none" | "left" | "right" | "top" | "bottom";
};

/**
 * The bad/good annotation (design doc §6).
 *
 * Always ships the glyph alongside the color — the accessibility floor (§7) is explicit that we
 * never rely on color alone, and a coral pill reads as "wrong" to nobody who can't see coral.
 */
export const Callout: React.FC<CalloutProps> = ({
  children,
  variant,
  delay = 0,
  from = "none",
}) => {
  const theme = useTheme();
  const entrance = useEnter({
    delay,
    duration: theme.duration.base,
    from,
    distance: theme.space[3],
  });

  const bad = variant === "bad";
  const accent = bad ? theme.color.state.bad : theme.color.state.good;
  const tint = bad ? theme.alpha.bad(0.12) : theme.alpha.good(0.12);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: theme.space[2],
        padding: `${theme.space[2]}px ${theme.space[4]}px`,
        borderRadius: theme.radius.pill,
        backgroundColor: tint,
        border: `${theme.hairline}px solid ${accent}`,
        opacity: entrance.opacity,
        scale: entrance.scale,
        translate: entrance.translate,
      }}
    >
      <span
        style={{
          ...theme.text.bodyMedium,
          color: accent,
          fontSize: theme.size.body,
          lineHeight: 1,
        }}
      >
        {bad ? "✕" : "✓"}
      </span>
      <span style={{ ...theme.text.bodyMedium, color: theme.color.text.primary }}>
        {children}
      </span>
    </div>
  );
};
