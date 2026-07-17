import {
  Callout,
  CodeBlock,
  LayerStack,
  Morph,
  Transition,
  useTheme,
  useTiming,
} from "@webbraces/design-system";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEATS, sceneAt } from "../beats";
import { StuckUi } from "../shared/StuckUi";
import { CONTEXTS, TOWER } from "../shared/towers";
import { BUG_CODE } from "./TheBug";

const at = sceneAt("theFix");

/**
 * Way two's towers hold one layer each, so they don't reuse the aha's slot counts — only its
 * columns, so the two fixes read as happening in the same room.
 *
 * The invariant is the aha's, inverted: the promoted context must end up with its floor ABOVE
 * the sidebar's ceiling. That is the whole difference between the two fixes.
 */
const WAY_TWO = {
  sidebarBottom: 420,
  dropdownBottom: 180,
  /** Clears `sidebarBottom + step` with room to read. */
  lift: -440,
} as const;

/**
 * REINFORCE, 3:30–4:12 — the two ways out.
 *
 * Way one plays out on the live mockup, not on a diagram, because it is the only moment in the
 * video where the viewer gets to see the bug actually fixed. Deleting the `opacity` line really
 * does destroy the stacking context, and the dropdown really does jump — Chromium does it, we
 * just get out of the way.
 */
export const TheFix: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { ms } = useTiming();

  const freed = interpolate(frame, [ms(at("3:36")), ms(at("3:38.5"))], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.out,
  });

  return (
    <AbsoluteFill>
      {/* ── One: remove what created the context ──────────────────────────── */}
      <Transition enterAt={at("3:30")} exitAt={at("3:49")} variant="softPush" direction="left">
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              left: theme.layout.safeMargin,
              top: "50%",
              translate: "0px -50%",
              width: 860,
            }}
          >
            <StuckUi delay={at("3:30")} freed={freed} />
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
            <CodeBlock
              code={BUG_CODE}
              language="css"
              delay={at("3:30")}
              reveal="instant"
              title="app.css"
              removeLines={[2]}
              removeAt={at("3:34")}
            />
          </div>

          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "flex-end",
              paddingBottom: theme.layout.safeMargin,
            }}
          >
            <Callout variant="good" delay={at("3:41")} from="bottom">
              the child rejoins the higher context
            </Callout>
          </AbsoluteFill>
        </AbsoluteFill>
      </Transition>

      {/* ── Two: promote an ancestor you control ──────────────────────────── */}
      <Transition enterAt={at("3:52")} variant="softPush" direction="left">
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              left: CONTEXTS.b.left,
              bottom: WAY_TWO.sidebarBottom,
              width: TOWER.width,
            }}
          >
            <LayerStack
              width={TOWER.width}
              layerHeight={TOWER.layerHeight}
              gap={TOWER.gap}
              slots={1}
              delay={at("3:53")}
              label="sidebar's context"
              labelAt={at("3:55")}
              layers={[{ id: "sidebar", label: ".sidebar", z: 10, slot: 0, delay: at("3:53.5") }]}
              boundary={{ at: at("3:54") }}
            />
          </div>

          {/*
            Deliberate and calm, per the script: one slow move on ease/soft. The dropdown does not
            animate separately — it rides the parent, because "it rides up with it" is the lesson.
          */}
          <div
            style={{
              position: "absolute",
              left: CONTEXTS.a.left,
              bottom: WAY_TWO.dropdownBottom,
              width: TOWER.width,
            }}
          >
            <Morph
              from={{ y: 0 }}
              to={{ y: WAY_TWO.lift }}
              at={at("3:58")}
              duration={1400}
              easing={theme.ease.soft}
            >
              <LayerStack
                width={TOWER.width}
                layerHeight={TOWER.layerHeight}
                gap={TOWER.gap}
                slots={1}
                delay={at("3:53")}
                label="a context you control"
                labelAt={at("4:02")}
                // z: 1 is the quiet punchline. Once the dropdown's context sits above the
                // sidebar's, the number it fought the whole video with stops mattering — the
                // lesson isn't "use bigger numbers", so the fix had better not use one.
                layers={[
                  {
                    id: "dropdown",
                    label: ".dropdown",
                    z: 1,
                    slot: 0,
                    variant: "brand",
                    delay: at("3:53.5"),
                  },
                ]}
                boundary={{ at: at("3:54") }}
              />
            </Morph>
          </div>
        </AbsoluteFill>
      </Transition>
    </AbsoluteFill>
  );
};

export const OPENS_ON = BEATS.wayOut1.vo;
