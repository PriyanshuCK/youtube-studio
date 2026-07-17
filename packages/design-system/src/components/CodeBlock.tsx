import React, { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useEnter, useStaggeredEnter } from "../motion/enter";
import { useTiming } from "../motion/timing";
import { useTheme } from "../theme/Theme";
import { CodeBlockContext, type CodeGeometry } from "./code/CodeBlockContext";
import { lineLength, tokenize, type Lang, type Line } from "./code/tokenize";

/** JetBrains Mono advances 0.6em per character. */
const CHAR_WIDTH_EM = 0.6;

export type CodeBlockProps = {
  code: string;
  language?: Lang;
  /** ms — when the panel arrives. */
  delay?: number;
  /**
   * `lines` staggers the code in line by line (reading order).
   * `type` types it out — for when the *writing* is the point.
   * `instant` when the code is already established and something else is the focus.
   */
  reveal?: "lines" | "type" | "instant";
  /** ms — total typing time for `reveal="type"`. */
  typeDuration?: number;
  /** 1-based line numbers to focus. Everything else dims — progressive disclosure. */
  focus?: number[];
  /** ms — when the focus applies. */
  focusAt?: number;
  /** Opacity of unfocused lines. */
  dim?: number;
  /** 1-based lines that fade away (e.g. deleting the line that caused the bug). */
  removeLines?: number[];
  /** ms. */
  removeAt?: number;
  showLineNumbers?: boolean;
  /** Filename label above the code. */
  title?: string;
  width?: number | string;
  /** Overlays that need line geometry — `<LineHighlight>`, mainly. */
  children?: React.ReactNode;
};

/**
 * Themed, animatable code (design doc §6). Code on screen is part of the motion graphic, not a
 * screenshot pasted in: it uses the brand syntax palette, arrives with the same easing as
 * everything else, and can hand a specific line to `<LineHighlight>`.
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "css",
  delay = 0,
  reveal = "lines",
  typeDuration,
  focus,
  focusAt = 0,
  dim = 0.28,
  removeLines,
  removeAt = 0,
  showLineNumbers = false,
  title,
  width,
  children,
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { ms } = useTiming();

  const lines = useMemo(() => tokenize(code.replace(/\n$/, ""), language), [code, language]);

  const lineHeight = theme.size.code * theme.lineHeight.normal;
  const charWidth = theme.size.code * CHAR_WIDTH_EM;
  const gutterWidth = showLineNumbers ? charWidth * 2 + theme.space[3] : 0;

  const geometry: CodeGeometry = useMemo(
    () => ({ lineHeight, fontSize: theme.size.code, gutter: gutterWidth, charWidth }),
    [lineHeight, theme.size.code, gutterWidth, charWidth],
  );

  const panel = useEnter({ delay, duration: theme.duration.base, easing: theme.ease.soft });

  // Typing is the one motion allowed a constant rate — it is mechanical by nature.
  const totalChars = lines.reduce((sum, line) => sum + lineLength(line) + 1, 0);
  const typedChars =
    reveal === "type"
      ? interpolate(
          frame,
          [ms(delay), ms(delay + (typeDuration ?? theme.duration.scene))],
          [0, totalChars],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.linear },
        )
      : Number.POSITIVE_INFINITY;

  return (
    <CodeBlockContext.Provider value={geometry}>
      <div
        style={{
          width,
          display: "flex",
          flexDirection: "column",
          gap: theme.space[3],
          padding: theme.layout.panelPadding,
          backgroundColor: theme.color.bg.panel,
          border: `${theme.hairline}px solid ${theme.color.bg.border}`,
          borderRadius: theme.radius.panel,
          opacity: panel.opacity,
          scale: panel.scale,
        }}
      >
        {title ? (
          <div style={{ ...theme.text.label, color: theme.color.text.muted }}>{title}</div>
        ) : null}

        <div style={{ position: "relative" }}>
          {lines.map((line, index) => (
            <CodeLine
              key={index}
              line={line}
              index={index}
              lineHeight={lineHeight}
              gutter={gutterWidth}
              showLineNumbers={showLineNumbers}
              reveal={reveal}
              delay={delay}
              typedChars={typedChars}
              charsBefore={lines
                .slice(0, index)
                .reduce((sum, l) => sum + lineLength(l) + 1, 0)}
              dimmed={
                focus !== undefined && focus.length > 0 && !focus.includes(index + 1)
                  ? interpolate(
                      frame,
                      [ms(focusAt), ms(focusAt + theme.duration.base)],
                      [1, dim],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: theme.ease.inout,
                      },
                    )
                  : 1
              }
              removed={
                removeLines?.includes(index + 1)
                  ? interpolate(
                      frame,
                      [ms(removeAt), ms(removeAt + theme.duration.move)],
                      [1, 0],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: theme.ease.inout,
                      },
                    )
                  : 1
              }
            />
          ))}
          {children}
        </div>
      </div>
    </CodeBlockContext.Provider>
  );
};

type CodeLineProps = {
  line: Line;
  index: number;
  lineHeight: number;
  gutter: number;
  showLineNumbers: boolean;
  reveal: NonNullable<CodeBlockProps["reveal"]>;
  delay: number;
  typedChars: number;
  charsBefore: number;
  dimmed: number;
  removed: number;
};

const CodeLine: React.FC<CodeLineProps> = ({
  line,
  index,
  lineHeight,
  gutter,
  showLineNumbers,
  reveal,
  delay,
  typedChars,
  charsBefore,
  dimmed,
  removed,
}) => {
  const theme = useTheme();

  const entrance = useStaggeredEnter(index, {
    delay,
    step: theme.stagger.tight,
    duration: theme.duration.base,
    easing: theme.ease.soft,
    from: "left",
    distance: theme.space[2],
  });

  const staggered = reveal === "lines";
  const opacity = (staggered ? entrance.opacity : 1) * dimmed * removed;

  let remaining = typedChars - charsBefore;

  return (
    <div
      style={{
        display: "flex",
        height: lineHeight,
        alignItems: "center",
        opacity,
        translate: staggered ? entrance.translate : undefined,
      }}
    >
      {showLineNumbers ? (
        <span
          style={{
            ...theme.text.code,
            width: gutter,
            color: theme.color.text.muted,
            textAlign: "right",
            paddingRight: theme.space[3],
            flexShrink: 0,
          }}
        >
          {index + 1}
        </span>
      ) : null}
      <span style={{ ...theme.text.code, whiteSpace: "pre" }}>
        {line.map((token, i) => {
          const visible = Math.max(0, Math.min(token.text.length, remaining));
          remaining -= token.text.length;
          if (visible === 0) return null;
          return (
            <span key={i} style={{ color: theme.syntax[token.kind] }}>
              {token.text.slice(0, visible)}
            </span>
          );
        })}
      </span>
    </div>
  );
};
