import { BraceFrame, CodeBlock, Theme, useTheme } from "@webbraces/design-system";
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { VIDEO } from "./constants";

const EXAMPLE = `.card {
  position: relative;
  z-index: 10;
}`;

/**
 * Starter scene — delete this and build the video's beats.
 * It exists to prove the design system is wired up: brand fonts, tokens, the brace signature.
 */
export const Starter: React.FC = () => {
  const theme = useTheme();

  return (
    <Theme>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: theme.space[7],
          padding: theme.layout.safeMargin,
        }}
      >
        <Sequence name="Title" layout="none">
          <BraceFrame delay={theme.duration.quick}>
            <div style={{ ...theme.text.display, textAlign: "center" }}>WebBraces</div>
          </BraceFrame>
        </Sequence>

        {/* Derived from fps, never a frame count — the delivery format is allowed to change. */}
        <Sequence name="Code" from={VIDEO.fps * 1.5} layout="none">
          <CodeBlock code={EXAMPLE} language="css" showLineNumbers title="card.css" />
        </Sequence>
      </AbsoluteFill>
    </Theme>
  );
};
