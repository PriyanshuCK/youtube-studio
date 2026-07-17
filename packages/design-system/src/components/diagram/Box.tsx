import React from "react";
import { useEnter, type EnterOptions } from "../../motion/enter";
import { useTheme } from "../../theme/Theme";

export type BoxVariant = "default" | "brand" | "focus" | "good" | "bad" | "ghost";

export type BoxProps = {
  children?: React.ReactNode;
  label?: string;
  width?: number | string;
  height?: number;
  /** `brand` = the mechanism / the point. `focus` = look here now. `ghost` = context, not subject. */
  variant?: BoxVariant;
  /** ms. */
  delay?: number;
  from?: EnterOptions["from"];
  /** Skip the entrance when the parent is already animating this box in. */
  static?: boolean;
  /** Multiplies the box's own opacity — for scene-level dimming. */
  opacity?: number;
  style?: React.CSSProperties;
};

const useVariantStyle = (variant: BoxVariant): React.CSSProperties => {
  const theme = useTheme();

  switch (variant) {
    case "brand":
      return {
        backgroundColor: theme.alpha.brand(0.14),
        border: `${theme.stroke.regular}px solid ${theme.color.accent.brand}`,
        color: theme.color.accent.brand,
        boxShadow: `0 0 ${theme.space[5]}px ${theme.alpha.brand(0.18)}`,
      };
    case "focus":
      return {
        backgroundColor: theme.alpha.focus(0.12),
        border: `${theme.stroke.regular}px solid ${theme.color.accent.focus}`,
        color: theme.color.accent.focus,
      };
    case "good":
      return {
        backgroundColor: theme.alpha.good(0.12),
        border: `${theme.stroke.regular}px solid ${theme.color.state.good}`,
        color: theme.color.state.good,
      };
    case "bad":
      return {
        backgroundColor: theme.alpha.bad(0.12),
        border: `${theme.stroke.regular}px solid ${theme.color.state.bad}`,
        color: theme.color.state.bad,
      };
    case "ghost":
      return {
        backgroundColor: "transparent",
        border: `${theme.hairline}px dashed ${theme.color.bg.divider}`,
        color: theme.color.text.muted,
      };
    default:
      return {
        backgroundColor: theme.color.bg.panel,
        border: `${theme.hairline}px solid ${theme.color.bg.border}`,
        color: theme.color.text.secondary,
      };
  }
};

/**
 * The diagram workhorse (design doc §6). Every mechanism visual is made of these, so a box in
 * video 012 means the same thing as a box in video 001 — viewers learn the grammar once.
 */
export const Box: React.FC<BoxProps> = ({
  children,
  label,
  width,
  height,
  variant = "default",
  delay = 0,
  from = "none",
  static: isStatic = false,
  opacity = 1,
  style,
}) => {
  const theme = useTheme();
  const variantStyle = useVariantStyle(variant);
  const entrance = useEnter({
    delay,
    duration: theme.duration.base,
    easing: theme.ease.out,
    from,
    distance: theme.space[3],
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: theme.space[2],
        width,
        height,
        padding: `${theme.space[2]}px ${theme.space[4]}px`,
        borderRadius: theme.radius.box,
        ...variantStyle,
        opacity: (isStatic ? 1 : entrance.opacity) * opacity,
        scale: isStatic ? 1 : entrance.scale,
        translate: isStatic ? undefined : entrance.translate,
        ...style,
      }}
    >
      {label ? (
        <span style={{ ...theme.text.bodyMedium, color: "inherit" }}>{label}</span>
      ) : null}
      {children}
    </div>
  );
};
