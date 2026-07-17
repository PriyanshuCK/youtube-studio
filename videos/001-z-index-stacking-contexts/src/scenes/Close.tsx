import { BraceFrame, Caret, Outro, Transition, useTheme } from "@webbraces/design-system";
import React from "react";
import { AbsoluteFill } from "remotion";
import { BEATS, sceneAt } from "../beats";

const at = sceneAt("close");

/**
 * CLOSE, 4:20–4:45 — the takeaway, then the wordmark.
 *
 * The braces close back around the one line the video exists to install. This is the only frame
 * in the video that is allowed to be a definition: by now the picture has already made it
 * inevitable, which is the whole reason it comes last (design doc §E).
 *
 * TODO(stage 7): the next-video card in the script's outro cue lands once video 002 exists.
 */
export const Close: React.FC = () => {
  const theme = useTheme();

  return (
    <AbsoluteFill>
      <Transition enterAt={at("4:20")} exitAt={at("4:36")} variant="fade">
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: theme.layout.safeMargin,
          }}
        >
          <BraceFrame delay={at("4:20.4")} braceSize={theme.size.h1 * 1.6}>
            <div style={{ ...theme.text.h1, textAlign: "center", maxWidth: 1240 }}>
              z-index is <span style={{ color: theme.color.accent.brand }}>local</span>. It sorts
              within a stacking context — not across the page.
              {/* "Next time an element won't come forward… find the context." */}
              <span style={{ marginLeft: theme.space[2] }}>
                <Caret delay={at("4:32")} height={theme.size.h1 * 0.8} />
              </span>
            </div>
          </BraceFrame>
        </AbsoluteFill>
      </Transition>

      <Transition enterAt={at("4:37")} variant="fade">
        <Outro cta="Pulling back the curtain, one thing a week." delay={at("4:37")} />
      </Transition>
    </AbsoluteFill>
  );
};

export const OPENS_ON = BEATS.takeaway.vo;
