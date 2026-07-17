import { createContext, useContext } from "react";

/**
 * Geometry a `<CodeBlock>` publishes so overlays (`<LineHighlight>`, carets) can sit on an
 * exact line without measuring the DOM — measurement is a frame-timing hazard in Remotion,
 * and code line boxes are perfectly predictable.
 */
export type CodeGeometry = {
  /** Height of one line box in px (`type/code` × line-height). */
  lineHeight: number;
  fontSize: number;
  /** Width of the line-number gutter, including its gap. 0 when numbers are off. */
  gutter: number;
  /** Width of one monospace character in px. */
  charWidth: number;
};

export const CodeBlockContext = createContext<CodeGeometry | null>(null);

export const useCodeGeometry = (): CodeGeometry => {
  const geometry = useContext(CodeBlockContext);
  if (!geometry) {
    throw new Error("This component must be rendered inside a <CodeBlock>.");
  }
  return geometry;
};
