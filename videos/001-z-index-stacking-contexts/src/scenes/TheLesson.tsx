import { LayerStack } from "@webbraces/design-system";
import React from "react";
import { AbsoluteFill } from "remotion";
import { BEATS, sceneAt } from "../beats";
import { CONTEXTS, TOWER } from "../shared/towers";

const at = sceneAt("theLesson");

/**
 * REINFORCE, 4:12–4:20 — the picture, settled.
 *
 * No arrows, no callouts, no text. The viewer has met this diagram twice and the narration says
 * the line; a caption here would be the frame repeating the words instead of reinforcing them.
 * The geometry is imported rather than retyped so this is provably the *same* picture as the
 * aha — which is the only reason showing it a third time is worth eight seconds.
 */
export const TheLesson: React.FC = () => (
  <AbsoluteFill>
    <div
      style={{
        position: "absolute",
        left: CONTEXTS.a.left,
        bottom: CONTEXTS.a.bottom,
        width: TOWER.width,
      }}
    >
      <LayerStack
        width={TOWER.width}
        layerHeight={TOWER.layerHeight}
        gap={TOWER.gap}
        slots={CONTEXTS.a.slots}
        delay={at("4:12.5")}
        label="lower context"
        labelAt={at("4:14")}
        layers={[
          { id: "card", label: ".card", z: 1, slot: 0, delay: at("4:13") },
          { id: "toast", label: ".toast", z: 50, slot: 1, delay: at("4:13.1") },
          { id: "modal", label: ".modal", z: 9999, slot: 2, variant: "brand", delay: at("4:13.2") },
        ]}
        boundary={{ label: "stacking context", at: at("4:13.5") }}
      />
    </div>

    <div
      style={{
        position: "absolute",
        left: CONTEXTS.b.left,
        bottom: CONTEXTS.b.bottom,
        width: TOWER.width,
      }}
    >
      <LayerStack
        width={TOWER.width}
        layerHeight={TOWER.layerHeight}
        gap={TOWER.gap}
        slots={CONTEXTS.b.slots}
        delay={at("4:12.5")}
        label="higher context"
        labelAt={at("4:14")}
        layers={[
          { id: "sidebar", label: ".sidebar", z: 10, slot: 0, delay: at("4:13.3") },
          { id: "header", label: ".header", z: 100, slot: 1, delay: at("4:13.4") },
        ]}
        boundary={{ at: at("4:13.6") }}
      />
    </div>
  </AbsoluteFill>
);

export const OPENS_ON = BEATS.theLesson.vo;
