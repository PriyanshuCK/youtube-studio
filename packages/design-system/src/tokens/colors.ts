/**
 * Color tokens — mirrors `docs/brand/WebBraces-Design-System.md` §1.
 * The design doc is authoritative; this file is its executable form.
 *
 * Discipline rule (doc §1): a frame may show ONE focus color at a time.
 * `accent.brand` (gold) = "this is the point". `accent.focus` (cyan) = "look here now".
 */

/** Raw values. Scenes should not reference these — use `color` below. */
export const primitive = {
  ink900: "#0C1018",
  ink800: "#121826",
  ink700: "#1B2334",
  ink600: "#2A3448",
  paper50: "#F2F5FB",
  paper300: "#AEB7C9",
  paper500: "#6E7893",
  gold400: "#F5C56B",
  gold600: "#C99A3E",
  cyan400: "#5EC8FF",
  coral400: "#FF7A6B",
  mint400: "#63E6A8",
} as const;

/** Semantic tokens — what every component and scene actually references. */
export const color = {
  /** `bg/base` — scene background. */
  bg: {
    base: primitive.ink900,
    /** `bg/panel` — code blocks, cards. */
    panel: primitive.ink800,
    /** Panel border / hairlines. */
    border: primitive.ink700,
    /** Muted dividers. */
    divider: primitive.ink600,
  },
  text: {
    /** `text/primary` — headlines, body. Off-white, never pure #FFF. */
    primary: primitive.paper50,
    secondary: primitive.paper300,
    /** `text/muted` — labels, captions. */
    muted: primitive.paper500,
  },
  accent: {
    /** `accent/brand` — the brace, emphasis, channel identity. */
    brand: primitive.gold400,
    /** Gold pressed / deep. */
    brandDeep: primitive.gold600,
    /** `accent/focus` — directs the eye to the current element. */
    focus: primitive.cyan400,
  },
  state: {
    /** `state/bad` — anti-pattern, error, before. */
    bad: primitive.coral400,
    /** `state/good` — correct pattern, after. */
    good: primitive.mint400,
  },
} as const;

/** Translucent derivations, for glows and boundaries. Keeps rgba() out of scenes. */
export const alpha = {
  brand: (a: number) => withAlpha(primitive.gold400, a),
  focus: (a: number) => withAlpha(primitive.cyan400, a),
  bad: (a: number) => withAlpha(primitive.coral400, a),
  good: (a: number) => withAlpha(primitive.mint400, a),
  panel: (a: number) => withAlpha(primitive.ink800, a),
  base: (a: number) => withAlpha(primitive.ink900, a),
  border: (a: number) => withAlpha(primitive.ink700, a),
  text: (a: number) => withAlpha(primitive.paper50, a),
} as const;

function withAlpha(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

export type Color = typeof color;
