/**
 * Spacing & layout tokens — mirrors `docs/brand/WebBraces-Design-System.md` §3.
 * 8px base grid: every spacing value in a scene is one of these.
 */

/** `space/1`…`space/8`. */
export const space = {
  1: 8,
  2: 16,
  3: 24,
  4: 32,
  5: 48,
  6: 64,
  7: 96,
  8: 128,
} as const;

export const layout = {
  /** `safe/margin` — title-safe margin from the frame edge (1920×1080). */
  safeMargin: 96,
  /** Code panels get 32px internal padding. */
  panelPadding: space[4],
  /**
   * Composition space. Every token in this package is authored in these px, exactly as the
   * design doc defines them ("Base = 32px at 1080p").
   *
   * This is NOT the delivered resolution — see `delivery` below. Compose at 1080p, ship 4K.
   */
  frame: { width: 1920, height: 1080 },
  fps: 60,
} as const;

/**
 * How a WebBraces master is delivered: 3840×2160 at 60fps.
 *
 * The composition stays 1920×1080 and is rendered at 2×. Nothing in these videos is a bitmap —
 * it is all DOM text, SVG, and borders — so Chromium rasterises the whole frame at twice the
 * density and the output is a true 4K master, not an upscale of a 1080p one.
 *
 * Doubling the composition instead would have meant doubling every token in the design doc (the
 * type scale, the 8px grid, the safe margin) and re-deriving every diagram's geometry, to land
 * on pixels that look identical. The doc says 1080p; the doc stays right.
 */
export const delivery = {
  scale: 2,
  width: layout.frame.width * 2,
  height: layout.frame.height * 2,
  fps: layout.fps,
  /** Visually lossless for flat colour and text, which is all we ship. */
  crf: 16,
} as const;

export const radius = {
  /** `radius/panel` — code panels, cards. */
  panel: 16,
  /** `radius/pill` — labels, tags. */
  pill: 999,
  box: 12,
} as const;

/** `hairline` — panel borders (ink-700). */
export const hairline = 1.5;

/** Stroke weights for diagram primitives, so no scene invents its own. */
export const stroke = {
  hairline,
  regular: 2,
  emphasis: 3,
  brace: 6,
} as const;

export type Spacing = {
  space: typeof space;
  layout: typeof layout;
  delivery: typeof delivery;
  radius: typeof radius;
  stroke: typeof stroke;
};
