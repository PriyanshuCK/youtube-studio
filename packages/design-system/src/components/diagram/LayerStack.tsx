import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useEnter } from "../../motion/enter";
import { useTiming } from "../../motion/timing";
import { useTheme } from "../../theme/Theme";
import { Box, type BoxVariant } from "./Box";

export type LayerSpec = {
  id: string;
  label: string;
  /**
   * Position from the base of the tower. Fractional values are the point: the scene interpolates
   * `slot` to make a layer climb, and the layer travels rather than teleports.
   */
  slot: number;
  variant?: BoxVariant;
  /** The z-index badge shown on the layer. */
  z?: number | string;
  /** ms — when this layer arrives. */
  delay?: number;
  /** Scene-level dimming. */
  opacity?: number;
};

export type LayerStackProps = {
  layers: LayerSpec[];
  width?: number;
  layerHeight?: number;
  /** Vertical gap between slots. */
  gap?: number;
  /** ms — when the tower's base line is drawn. */
  delay?: number;
  /** Name under the base. */
  label?: string;
  /**
   * ms — when the name appears. Defaults to `delay`.
   * The picture usually earns its name a beat later than it arrives: show the thing, then
   * call it a stacking context (design doc §E — the definition is the ending point).
   */
  labelAt?: number;
  /**
   * The translucent "context boundary" that seals the tower. Passing this is what turns a stack
   * of layers into a *stacking context* on screen.
   */
  boundary?: { label?: string; at: number; variant?: "brand" | "focus" | "bad" };
  /** Total slots to reserve height for. Defaults to the highest slot in `layers`. */
  slots?: number;
};

/**
 * A tower of layers with a visible base — the channel's picture for any "what sits on top of
 * what" mechanism (paint order, stacking contexts, compositing).
 *
 * The base line is drawn, not implied, because the whole payoff of video 001 is that a layer can
 * top its own tower and still sit below another tower's *base*. If the base isn't on screen, the
 * aha has nothing to land against.
 */
export const LayerStack: React.FC<LayerStackProps> = ({
  layers,
  width = 380,
  layerHeight = 64,
  gap,
  delay = 0,
  label,
  labelAt,
  boundary,
  slots,
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { ms } = useTiming();

  const spacing = gap ?? theme.space[2];
  const step = layerHeight + spacing;
  const reserved = slots ?? Math.ceil(Math.max(...layers.map((l) => l.slot), 0)) + 1;
  const height = reserved * step;

  const base = useEnter({ delay, duration: theme.duration.base, easing: theme.ease.soft });
  const name = useEnter({
    delay: labelAt ?? delay,
    duration: theme.duration.base,
    easing: theme.ease.soft,
  });

  const boundaryAccent =
    boundary?.variant === "bad"
      ? theme.color.state.bad
      : boundary?.variant === "focus"
        ? theme.color.accent.focus
        : theme.color.accent.brand;

  // The boundary snaps in from slightly oversized — it reads as clamping shut around the tower.
  const boundaryProgress = boundary
    ? interpolate(frame, [ms(boundary.at), ms(boundary.at + theme.duration.move)], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: theme.ease.out,
      })
    : 0;

  return (
    <div style={{ position: "relative", width, height }}>
      {boundary ? (
        <div
          style={{
            position: "absolute",
            inset: -theme.space[3],
            borderRadius: theme.radius.panel,
            border: `${theme.stroke.regular}px dashed ${boundaryAccent}`,
            backgroundColor: theme.alpha.brand(0.04),
            opacity: boundaryProgress,
            scale: interpolate(boundaryProgress, [0, 1], [1.06, 1]),
          }}
        >
          {boundary.label ? (
            <span
              style={{
                position: "absolute",
                top: -theme.space[4],
                left: theme.space[3],
                ...theme.text.label,
                color: boundaryAccent,
                backgroundColor: theme.color.bg.base,
                padding: `0 ${theme.space[1]}px`,
              }}
            >
              {boundary.label}
            </span>
          ) : null}
        </div>
      ) : null}

      {layers.map((layer) => (
        <div
          key={layer.id}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: layer.slot * step,
          }}
        >
          <Box
            variant={layer.variant ?? "default"}
            height={layerHeight}
            delay={layer.delay ?? delay}
            opacity={layer.opacity ?? 1}
            style={{ justifyContent: "space-between" }}
          >
            <span
              style={{ ...theme.text.bodyMedium, color: "inherit", whiteSpace: "nowrap" }}
            >
              {layer.label}
            </span>
            {layer.z !== undefined ? (
              <span
                style={{
                  ...theme.text.code,
                  fontSize: theme.size.caption,
                  color: "inherit",
                  opacity: 0.85,
                  // A wrapped `z: 9999` turns the badge into two lines and the layer into a mess.
                  whiteSpace: "nowrap",
                  padding: `${theme.space[1] / 2}px ${theme.space[2]}px`,
                  borderRadius: theme.radius.pill,
                  backgroundColor: theme.alpha.base(0.45),
                }}
              >
                z: {layer.z}
              </span>
            ) : null}
          </Box>
        </div>
      ))}

      {/*
        The base of the tower. Deliberately the brightest line in the component: "below the base
        of the taller tower" is a claim the viewer has to be able to check by eye, and a hairline
        in divider grey disappears into the boundary next to it.
      */}
      <div
        style={{
          position: "absolute",
          bottom: -theme.space[2],
          left: -theme.space[3],
          right: -theme.space[3],
          height: theme.stroke.emphasis,
          borderRadius: theme.stroke.hairline,
          backgroundColor: theme.color.text.muted,
          opacity: base.opacity,
          clipPath: `inset(0 ${interpolate(base.progress, [0, 1], [100, 0])}% 0 0)`,
        }}
      />
      {label ? (
        <span
          style={{
            position: "absolute",
            // Clear of the boundary's bottom edge, which sits at -space[3].
            bottom: -theme.space[6],
            left: 0,
            right: 0,
            textAlign: "center",
            ...theme.text.label,
            color: theme.color.text.muted,
            opacity: name.opacity,
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
};
