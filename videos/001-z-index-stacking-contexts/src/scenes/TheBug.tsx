import {
  CodeBlock,
  LayerStack,
  LineHighlight,
  useTheme,
  useTiming,
} from "@webbraces/design-system";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEATS, sceneAt } from "../beats";
import { StuckUi } from "../shared/StuckUi";
import { TOWER } from "../shared/towers";

const at = sceneAt("theBug");

export const BUG_CODE = `.parent {
  opacity: 0.98;
}

.dropdown {
  position: absolute;
  z-index: 9999;
}`;

/**
 * REINFORCE, 3:00–3:30 — the viewer's actual bug, diagnosed.
 *
 * The UI hands off to the towers at 3:20 rather than sharing the frame with them: the point of
 * the beat is that the towers *explain* the UI, and showing both at once invites the viewer to
 * study the mockup while the narration is talking about paint order.
 */
export const TheBug: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { ms } = useTiming();

  // The mockup steps aside for the diagram of why it's broken.
  const uiOpacity = interpolate(frame, [ms(at("3:19")), ms(at("3:21"))], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.inout,
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: theme.layout.safeMargin,
          top: "50%",
          translate: "0px -50%",
          width: 860,
          height: 448,
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <StuckUi delay={at("3:00.3")} opacity={uiOpacity} />
        </div>

        {/* The same two worlds from the aha, now wearing the names from the viewer's stylesheet. */}
        <div style={{ position: "absolute", left: 0, bottom: 24, width: TOWER.width }}>
          <LayerStack
            width={TOWER.width}
            layerHeight={TOWER.layerHeight}
            gap={TOWER.gap}
            slots={1}
            delay={at("3:21")}
            label="parent's context"
            labelAt={at("3:24")}
            layers={[
              {
                id: "dropdown",
                label: ".dropdown",
                z: 9999,
                slot: 0,
                variant: "brand",
                delay: at("3:21.5"),
              },
            ]}
            boundary={{ at: at("3:22") }}
          />
        </div>

        <div style={{ position: "absolute", left: 420, bottom: 272, width: TOWER.width }}>
          <LayerStack
            width={TOWER.width}
            layerHeight={TOWER.layerHeight}
            gap={TOWER.gap}
            slots={1}
            delay={at("3:22")}
            label="sidebar's context"
            labelAt={at("3:24.2")}
            layers={[{ id: "sidebar", label: ".sidebar", z: 10, slot: 0, delay: at("3:22.5") }]}
            boundary={{ at: at("3:23") }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 1100,
          top: "50%",
          translate: "0px -50%",
          width: 620,
        }}
      >
        <CodeBlock code={BUG_CODE} language="css" delay={at("3:02")} title="app.css">
          {/* The one line that did it. */}
          <LineHighlight line={2} at={at("3:14")} />
        </CodeBlock>
      </div>
    </AbsoluteFill>
  );
};

export const OPENS_ON = BEATS.fixTheBug.vo;
