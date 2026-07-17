import { Caret, useTheme } from "@webbraces/design-system";
import React from "react";
import { AbsoluteFill } from "remotion";
import { BEATS, sceneAt } from "../beats";
import { StuckUi } from "../shared/StuckUi";
import { ZBadge } from "../shared/ZBadge";

const at = sceneAt("hookStuck");

/**
 * HOOK, 0:00–0:13 — the bug, and the number that won't fix it.
 *
 * The only thing that moves in this scene is the number. That is the point: the viewer has
 * already lived this, and the frame's job is to make them recognise it, not to entertain them.
 * The stillness *is* the joke — restraint here is what earns the reveal at 0:13.
 */
export const HookStuck: React.FC = () => {
  const theme = useTheme();

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: theme.space[6],
        padding: theme.layout.safeMargin,
      }}
    >
      <StuckUi delay={at("0:00.3")} />

      <div style={{ display: "flex", alignItems: "center", gap: theme.space[3] }}>
        <ZBadge
          steps={[
            { at: at("0:02"), value: "9999" },
            // "So you go higher. Nothing."
            { at: at("0:08"), value: "99999" },
            { at: at("0:10.5"), value: "999999" },
          ]}
          struckAt={at("0:05")}
        />
        <Caret delay={at("0:02.4")} height={theme.size.h2} />
      </div>
    </AbsoluteFill>
  );
};

export const OPENS_ON = BEATS.hookSet.vo;
