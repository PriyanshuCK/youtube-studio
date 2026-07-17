/**
 * Typography tokens — mirrors `docs/brand/WebBraces-Design-System.md` §2.
 *
 * Display carries personality, body stays neutral at video compression, mono is
 * JetBrains Mono specifically for 1080p readability (tall x-height survives the encoder).
 * Scale ratio 1.25 (major third), base 32px @1080p — video is viewed at distance, so bias large.
 */

export const font = {
  /** Titles. Used large, with restraint. */
  display: "Clash Display, ui-sans-serif, system-ui, sans-serif",
  /** Body, labels, captions. */
  body: "Satoshi, ui-sans-serif, system-ui, sans-serif",
  /** Code. Ligatures on. */
  mono: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace",
} as const;

export const weight = {
  display: 600,
  body: 400,
  bodyMedium: 500,
  code: 400,
  codeBold: 700,
} as const;

/** px @1080p. */
export const size = {
  display: 96,
  h1: 64,
  h2: 48,
  body: 32,
  code: 30,
  caption: 24,
} as const;

export const lineHeight = {
  /** Display + headings. */
  tight: 1.14,
  /** Body and code. */
  normal: 1.5,
} as const;

export const tracking = {
  display: "-0.02em",
  body: "0em",
  /** Caption/label uppercase needs air. */
  label: "0.08em",
} as const;

/** Ready-made text styles, so scenes never re-assemble a face + size + weight by hand. */
export const text = {
  display: {
    fontFamily: font.display,
    fontWeight: weight.display,
    fontSize: size.display,
    lineHeight: lineHeight.tight,
    letterSpacing: tracking.display,
  },
  h1: {
    fontFamily: font.display,
    fontWeight: weight.display,
    fontSize: size.h1,
    lineHeight: lineHeight.tight,
    letterSpacing: tracking.display,
  },
  h2: {
    fontFamily: font.display,
    fontWeight: weight.display,
    fontSize: size.h2,
    lineHeight: lineHeight.tight,
    letterSpacing: tracking.display,
  },
  body: {
    fontFamily: font.body,
    fontWeight: weight.body,
    fontSize: size.body,
    lineHeight: lineHeight.normal,
  },
  bodyMedium: {
    fontFamily: font.body,
    fontWeight: weight.bodyMedium,
    fontSize: size.body,
    lineHeight: lineHeight.normal,
  },
  code: {
    fontFamily: font.mono,
    fontWeight: weight.code,
    fontSize: size.code,
    lineHeight: lineHeight.normal,
    fontFeatureSettings: '"liga" 1, "calt" 1',
  },
  caption: {
    fontFamily: font.body,
    fontWeight: weight.bodyMedium,
    fontSize: size.caption,
    lineHeight: lineHeight.normal,
  },
  /** Small uppercase label — diagram tags, lower thirds. */
  label: {
    fontFamily: font.body,
    fontWeight: weight.bodyMedium,
    fontSize: size.caption,
    lineHeight: lineHeight.normal,
    letterSpacing: tracking.label,
    textTransform: "uppercase",
  },
} as const;

export type Typography = {
  font: typeof font;
  weight: typeof weight;
  size: typeof size;
  lineHeight: typeof lineHeight;
  tracking: typeof tracking;
  text: typeof text;
};
