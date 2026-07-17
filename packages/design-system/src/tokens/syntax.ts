/**
 * Syntax palette for code on screen — the `code-theme` referenced by
 * `docs/brand/WebBraces-Design-System.md` §1.
 *
 * Harmonized with the brand so code and motion graphics feel like one design, not a
 * screenshot pasted in: keywords gold, strings mint, functions cyan, comments muted.
 *
 * Note on what is deliberately absent: coral is reserved channel-wide for "the wrong way".
 * Numbers therefore take `gold-600` (deep gold) rather than the usual red — a number in a
 * code panel must never read as an error.
 */

import { color, primitive } from "./colors";

export type TokenKind =
  | "plain"
  | "keyword"
  | "string"
  | "function"
  | "comment"
  | "number"
  | "property"
  | "punctuation"
  | "selector"
  | "tag";

export const syntax: Record<TokenKind, string> = {
  plain: color.text.primary,
  keyword: color.accent.brand,
  string: color.state.good,
  function: color.accent.focus,
  comment: color.text.muted,
  number: primitive.gold600,
  property: color.accent.focus,
  punctuation: color.text.secondary,
  selector: color.accent.brand,
  tag: color.accent.brand,
};
