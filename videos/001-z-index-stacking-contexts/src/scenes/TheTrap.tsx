import {
  Box,
  CodeBlock,
  LineHighlight,
  LayerStack,
  useTheme,
  useTiming,
} from "@webbraces/design-system";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEATS, sceneAt } from "../beats";
import { TOWER } from "../shared/towers";

const at = sceneAt("theTrap");

const CODE = `.parent {
  transform: translateZ(0);
}

.child {
  position: absolute;
  z-index: 9999;
}`;

/**
 * CLARIFY, 2:25–3:00 — the trap.
 *
 * The cause and the effect share the frame: the `transform` line on the left, the boundary
 * snapping shut on the right. The child's z-index really does work — it climbs over `.card`,
 * inside the parent — and that is what makes the ceiling land. If the number did nothing at all
 * the viewer would conclude z-index is broken, which is the misconception, not the fix.
 */
export const TheTrap: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { ms } = useTiming();

  const track = (keys: [string, number][]) =>
    interpolate(
      frame,
      keys.map(([tc]) => ms(at(tc))),
      keys.map(([, value]) => value),
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.inout },
    );

  // "Your child's z-index can climb all it wants…"
  const spin = Math.round(
    track([
      ["2:45", 1],
      ["2:49", 9999],
    ]),
  );

  // …and it does climb — over its sibling, inside the parent. Then it hits the ceiling.
  const childSlot = track([
    ["2:45", 0],
    ["2:47", 1],
    ["2:50", 1],
    ["2:51.5", 1.1],
  ]);
  const cardSlot = track([
    ["2:45", 1],
    ["2:47", 0],
  ]);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: theme.layout.safeMargin,
          top: "50%",
          translate: "0px -50%",
          width: 620,
        }}
      >
        <CodeBlock code={CODE} language="css" delay={at("2:27")} title="app.css">
          <LineHighlight line={2} at={at("2:32")} />
        </CodeBlock>
      </div>

      {/* The sibling the child is trying to get above. Outside the parent, so: out of reach. */}
      <div style={{ position: "absolute", left: 1180, bottom: 520, width: TOWER.width }}>
        <Box
          variant="default"
          height={TOWER.layerHeight}
          delay={at("2:29")}
          style={{ justifyContent: "space-between" }}
        >
          <span style={{ ...theme.text.bodyMedium, color: "inherit" }}>.sibling</span>
          <span
            style={{
              ...theme.text.code,
              fontSize: theme.size.caption,
              color: "inherit",
              opacity: 0.85,
            }}
          >
            z: 1
          </span>
        </Box>
      </div>

      <div style={{ position: "absolute", left: 1180, bottom: 220, width: TOWER.width }}>
        <LayerStack
          width={TOWER.width}
          layerHeight={TOWER.layerHeight}
          gap={TOWER.gap}
          slots={2}
          delay={at("2:28")}
          label="the parent"
          labelAt={at("2:40")}
          layers={[
            { id: "card", label: ".card", z: 1, slot: cardSlot, delay: at("2:30") },
            {
              id: "child",
              label: ".child",
              z: spin,
              slot: childSlot,
              variant: "brand",
              delay: at("2:31"),
            },
          ]}
          // The moment `transform` lands, the parent stops being a parent and starts being a wall.
          boundary={{ label: "stacking context", at: at("2:38") }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const OPENS_ON = BEATS.sealedIn.vo;
