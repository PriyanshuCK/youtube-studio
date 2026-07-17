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
  frame: { width: 1920, height: 1080 },
  fps: 30,
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
  radius: typeof radius;
  stroke: typeof stroke;
};
