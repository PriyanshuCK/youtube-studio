import React from "react";
import { AbsoluteFill } from "remotion";
import { useEnter } from "../motion/enter";
import { useTheme } from "../theme/Theme";
import { BraceFrame } from "./BraceFrame";

export type OutroProps = {
  /** The one-line takeaway. Braces close back around it. */
  takeaway?: React.ReactNode;
  /** Defaults to the channel wordmark. */
  wordmark?: string;
  /** A subtle CTA line. */
  cta?: string;
  /** ms. */
  delay?: number;
};

/**
 * The closing bookend (design doc §5): braces close back around the takeaway, then the wordmark.
 * The definition is the ending point, not the start — this is where the video is allowed to
 * simply state the thing, because the picture already made it inevitable.
 */
export const Outro: React.FC<OutroProps> = ({
  takeaway,
  wordmark = "WebBraces",
  cta,
  delay = 0,
}) => {
  const theme = useTheme();

  const mark = useEnter({
    delay: delay + theme.duration.scene,
    duration: theme.duration.base,
    easing: theme.ease.soft,
  });
  const call = useEnter({
    delay: delay + theme.duration.scene + theme.duration.move,
    duration: theme.duration.base,
    easing: theme.ease.soft,
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: theme.space[6],
        padding: theme.layout.safeMargin,
      }}
    >
      {takeaway ? (
        <BraceFrame delay={delay} braceSize={theme.size.h1 * 1.4}>
          <div style={{ ...theme.text.h1, textAlign: "center", maxWidth: 1200 }}>
            {takeaway}
          </div>
        </BraceFrame>
      ) : null}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: theme.space[3],
        }}
      >
        <div
          style={{
            ...theme.text.display,
            color: theme.color.accent.brand,
            opacity: mark.opacity,
            scale: mark.scale,
          }}
        >
          <span style={{ fontFamily: theme.font.mono }}>{"{ "}</span>
          <span style={{ color: theme.color.text.primary }}>{wordmark}</span>
          <span style={{ fontFamily: theme.font.mono }}>{" }"}</span>
        </div>
        {cta ? (
          <span
            style={{
              ...theme.text.body,
              color: theme.color.text.muted,
              opacity: call.opacity,
            }}
          >
            {cta}
          </span>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
