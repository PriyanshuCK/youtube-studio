import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AbsoluteFill, cancelRender, continueRender, delayRender } from "remotion";
import { ease } from "../motion/easing";
import {
  alpha,
  color,
  curve,
  delivery,
  duration,
  enterFrom,
  font,
  hairline,
  layout,
  lineHeight,
  radius,
  size,
  space,
  stagger,
  stroke,
  syntax,
  text,
  tracking,
  weight,
} from "../tokens";
import { loadBrandFonts } from "./fonts";

/** Everything the design doc defines, in one object. Read it with `useTheme()`. */
export const theme = {
  color,
  alpha,
  syntax,
  font,
  weight,
  size,
  lineHeight,
  tracking,
  text,
  space,
  layout,
  delivery,
  radius,
  stroke,
  hairline,
  ease,
  curve,
  duration,
  stagger,
  enterFrom,
} as const;

export type ThemeValue = typeof theme;

const ThemeContext = createContext<ThemeValue>(theme);

/**
 * Token access inside components. The tokens are also importable directly — the context
 * exists so a scene can be re-themed (e.g. a light thumbnail variant) without a rewrite.
 */
export const useTheme = (): ThemeValue => useContext(ThemeContext);

export type ThemeProps = {
  children: React.ReactNode;
  /** Scene background. Defaults to `bg/base` (deep ink navy — never pure black). */
  background?: string;
  /**
   * A barely-there radial lift behind the content, so the frame reads as lit ink rather than
   * a flat dashboard (design doc §1 rationale). Off for scenes that need a dead-even field.
   */
  glow?: boolean;
};

/**
 * Wraps a scene: brand background, base text style, and the token context.
 * Every composition starts here.
 */
export const Theme: React.FC<ThemeProps> = ({
  children,
  background = color.bg.base,
  glow = true,
}) => {
  const value = useMemo(() => theme, []);

  // The handle is opened during render (not in the effect) so the frame can never be captured
  // before the faces are in — a useEffect alone would let frame 0 through unstyled.
  const [handle] = useState(() => delayRender("Loading WebBraces brand fonts"));

  useEffect(() => {
    loadBrandFonts()
      .then(() => continueRender(handle))
      .catch((err: Error) => cancelRender(err));
  }, [handle]);

  return (
    <ThemeContext.Provider value={value}>
      <AbsoluteFill
        style={{
          backgroundColor: background,
          color: color.text.primary,
          ...text.body,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {glow ? (
          <AbsoluteFill
            style={{
              background: `radial-gradient(70% 55% at 50% 42%, ${alpha.panel(
                0.9,
              )} 0%, ${alpha.base(0)} 100%)`,
            }}
          />
        ) : null}
        {children}
      </AbsoluteFill>
    </ThemeContext.Provider>
  );
};
