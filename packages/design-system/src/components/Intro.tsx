import React from "react";
import { AbsoluteFill } from "remotion";
import { useEnter } from "../motion/enter";
import { useTheme } from "../theme/Theme";
import { BraceFrame } from "./BraceFrame";

export type IntroProps = {
  title: string;
  /** Optional kicker above the title — the series or section name. */
  eyebrow?: string;
  /** ms. */
  delay?: number;
  /** ms — when the braces open outward to hand off to the explanation. */
  openAt?: number;
};

/**
 * The standard title bookend (design doc §5): braces sweep in and close around the title,
 * then open outward — literally "opening up" the mechanism the video is about.
 */
export const Intro: React.FC<IntroProps> = ({ title, eyebrow, delay = 0, openAt }) => {
  const theme = useTheme();
  const kicker = useEnter({ delay: delay + theme.duration.scene * 0.4 });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: theme.layout.safeMargin,
      }}
    >
      <BraceFrame delay={delay} openAt={openAt} fadeOnOpen>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: theme.space[3],
          }}
        >
          {eyebrow ? (
            <span
              style={{
                ...theme.text.label,
                color: theme.color.text.muted,
                opacity: kicker.opacity,
              }}
            >
              {eyebrow}
            </span>
          ) : null}
          <h1 style={{ ...theme.text.display, margin: 0, textAlign: "center" }}>{title}</h1>
        </div>
      </BraceFrame>
    </AbsoluteFill>
  );
};
