/**
 * @webbraces/design-system — the source of truth in code.
 *
 * `docs/brand/WebBraces-Design-System.md` is the source of truth in prose. When the two
 * disagree, the doc wins and this package is what changes.
 *
 * Scenes import from here and nowhere else: no hardcoded hex, no hardcoded spacing,
 * no default easings.
 */

// Tokens
export * from "./tokens";

// Theme
export { Theme, theme, useTheme, type ThemeProps, type ThemeValue } from "./theme/Theme";
export { loadBrandFonts } from "./theme/fonts";

// Motion
export * from "./motion";

// Signature + bookends
export { BraceFrame, type BraceFrameProps } from "./components/BraceFrame";
export { Intro, type IntroProps } from "./components/Intro";
export { Outro, type OutroProps } from "./components/Outro";
export { Transition, type TransitionProps, type TransitionVariant } from "./components/Transition";

// Code
export { CodeBlock, type CodeBlockProps } from "./components/CodeBlock";
export { LineHighlight, type LineHighlightProps } from "./components/LineHighlight";
export { useCodeGeometry, type CodeGeometry } from "./components/code/CodeBlockContext";
export { tokenize, type Lang, type Line, type Token } from "./components/code/tokenize";

// Annotation
export { Callout, type CalloutProps } from "./components/Callout";
export { Caret, type CaretProps } from "./components/Caret";
export { LowerThird, type LowerThirdProps } from "./components/LowerThird";
export { StepReveal, type StepItem, type StepRevealProps } from "./components/StepReveal";

// Diagram primitives
export { Arrow, type ArrowProps, type Point } from "./components/diagram/Arrow";
export { Box, type BoxProps, type BoxVariant } from "./components/diagram/Box";
export {
  LayerStack,
  type LayerSpec,
  type LayerStackProps,
} from "./components/diagram/LayerStack";
export { Morph, type MorphProps, type MorphState } from "./components/diagram/Morph";
