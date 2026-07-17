import {
  Arrow,
  Callout,
  Caret,
  LayerStack,
  useTheme,
  useTiming,
  type LayerSpec,
} from "@webbraces/design-system";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEATS, sceneAt } from "../beats";
import { AHA, CONTEXTS, TOWER } from "../shared/towers";

const at = sceneAt("contexts");

/**
 * CLARIFY, 0:20–1:47 — the flat model, the split, the sort within a context, and the aha.
 *
 * One scene, not four, because it is one diagram. The five layers that make the flat tower are
 * the same five objects that separate into two towers, and the viewer has to be able to see that
 * they *are* the same — motion tracks meaning (design doc §4.4). Cutting here would force them
 * to re-establish the picture each time and the thread would break.
 */
export const Contexts: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { ms } = useTiming();

  /** Keyframes in script timecodes → a value. Everything in this scene is timed this way. */
  const track = (keys: [string, number][]) =>
    interpolate(
      frame,
      keys.map(([tc]) => ms(at(tc))),
      keys.map(([, value]) => value),
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.inout },
    );

  // ── The split (0:35) ────────────────────────────────────────────────────────
  // The towers travel apart; the layers redistribute into the world each belongs to.
  const aLeft = track([
    ["0:35", CONTEXTS.merged.left],
    ["0:36.2", CONTEXTS.a.left],
  ]);
  const bLeft = track([
    ["0:35", CONTEXTS.merged.left],
    ["0:36.2", CONTEXTS.b.left],
  ]);
  const aBottom = track([
    ["0:35", CONTEXTS.merged.bottom],
    ["0:36.2", CONTEXTS.a.bottom],
  ]);

  // ── The lift (1:07) ─────────────────────────────────────────────────────────
  // Tower B rises to where it actually sits in paint order. This is the reveal: contexts are
  // themselves stacked, and A's whole world sits below B's floor. Until now the two towers have
  // shared a floor, which is exactly the assumption being taken away.
  const bBottom = track([
    ["0:35", CONTEXTS.merged.bottom],
    ["0:36.2", CONTEXTS.a.bottom],
    ["1:07", CONTEXTS.a.bottom],
    ["1:08.5", CONTEXTS.b.bottom],
  ]);

  // ── Slots ───────────────────────────────────────────────────────────────────
  // Flat phase: all five sorted by raw z (the misconception — one global ranking).
  // Split: each tower holds its own elements, in source order — we haven't sorted yet.
  // 0:55: z-index sorts them, but only inside tower A's world.
  const modalSlot = track([
    ["0:35", 4],
    ["0:36.2", 1],
    ["0:55", 1],
    ["0:56.5", 2],
    ["1:09", 2],
    ["1:10.5", 2.12], // presses against its own ceiling: as high as z-index can take it
  ]);
  const toastSlot = track([
    ["0:55", 2],
    ["0:56.5", 1],
  ]);
  const sidebarSlot = track([
    ["0:35", 1],
    ["0:36.2", 0],
  ]);
  const headerSlot = track([
    ["0:35", 3],
    ["0:36.2", 1],
  ]);

  // Reserved height shrinks as each tower gives up the other's layers.
  const aSlots = track([
    ["0:35", 5],
    ["0:36.2", 3],
  ]);
  const bSlots = track([
    ["0:35", 4],
    ["0:36.2", 2],
  ]);

  // ── The zoom (0:47) ─────────────────────────────────────────────────────────
  // Into tower A to watch z-index do its job, back out for the aha.
  // Solves for tower A's centre landing on the frame centre at 1.5×:
  //   translate = -scale × (towerCentre - frameCentre)
  const aCentre = {
    x: CONTEXTS.a.left + TOWER.width / 2,
    y: 1080 - (CONTEXTS.a.bottom + (CONTEXTS.a.slots * TOWER.step) / 2),
  };
  const zoomScale = 1.5;
  const zoomTo = {
    x: -zoomScale * (aCentre.x - 1920 / 2),
    y: -zoomScale * (aCentre.y - 1080 / 2),
  };

  const zoom = track([
    ["0:47", 0],
    ["0:48.5", 1],
    ["1:05", 1],
    ["1:06.5", 0],
  ]);

  // Tower B recedes while we're inside tower A. At 1.5× it otherwise sits half-cropped at the
  // frame edge, competing with the sort it is not part of — one focal point per frame.
  const bFocus = track([
    ["0:47", 1],
    ["0:48.5", 0.12],
    ["1:05", 0.12],
    ["1:06.5", 1],
  ]);

  // The callouts take over as the focal point at 1:30, so the diagram steps back.
  const stageFocus = track([
    ["1:30", 1],
    ["1:32", 0.45],
  ]);

  const flatLabel = interpolate(
    frame,
    [ms(at("0:22")), ms(at("0:23")), ms(at("0:34.5")), ms(at("0:35.5"))],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.soft },
  );

  /** Entrance order is bottom-to-top, so the eye builds the tower the way it reads. */
  const arrival = (flatSlot: number) => at("0:21") + flatSlot * theme.stagger.base;

  const towerA: LayerSpec[] = [
    { id: "card", label: ".card", z: 1, slot: 0, delay: arrival(0) },
    { id: "toast", label: ".toast", z: 50, slot: toastSlot, delay: arrival(2) },
    { id: "modal", label: ".modal", z: 9999, slot: modalSlot, variant: "brand", delay: arrival(4) },
  ];

  const towerB: LayerSpec[] = [
    { id: "sidebar", label: ".sidebar", z: 10, slot: sidebarSlot, delay: arrival(1) },
    { id: "header", label: ".header", z: 100, slot: headerSlot, delay: arrival(3) },
  ];

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: stageFocus,
          translate: `${zoom * zoomTo.x}px ${zoom * zoomTo.y}px`,
          scale: interpolate(zoom, [0, 1], [1, zoomScale]),
        }}
      >
        <div style={{ position: "absolute", left: aLeft, bottom: aBottom, width: TOWER.width }}>
          <LayerStack
            layers={towerA}
            width={TOWER.width}
            layerHeight={TOWER.layerHeight}
            gap={TOWER.gap}
            slots={aSlots}
            delay={at("0:20.5")}
            label="lower context"
            labelAt={at("1:14")}
            boundary={{ label: "stacking context", at: at("0:38") }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: bLeft,
            bottom: bBottom,
            width: TOWER.width,
            opacity: bFocus,
          }}
        >
          <LayerStack
            layers={towerB}
            width={TOWER.width}
            layerHeight={TOWER.layerHeight}
            gap={TOWER.gap}
            slots={bSlots}
            delay={at("0:20.5")}
            label="higher context"
            labelAt={at("1:14")}
            boundary={{ at: at("0:40") }}
          />
        </div>

        {/* The name for the picture we're about to take away. */}
        <span
          style={{
            position: "absolute",
            left: CONTEXTS.merged.left,
            width: TOWER.width,
            bottom: CONTEXTS.merged.bottom - theme.space[6],
            textAlign: "center",
            ...theme.text.label,
            color: theme.color.text.muted,
            opacity: flatLabel,
          }}
        >
          the page — one big stack
        </span>

        {/*
          The aha, made checkable: the gold element has climbed as high as z-index can take it,
          and the arrow lands on the floor of the tower next door. Muted on purpose — gold is
          already saying "this is the point", and two focus colours would split the frame.
        */}
        <Arrow
          from={AHA.from}
          to={AHA.to}
          bow={-theme.space[5]}
          at={at("1:12")}
          dashed
          color={theme.color.text.muted}
          label="still below this"
        />
      </AbsoluteFill>

      {/*
        1:30 — "The number's not being ignored. It's just local."
        Bottom-right, which the diagonal of the two towers leaves empty. Under the towers would
        have crowded tower A's label; the verdict on the picture gets its own quadrant.
      */}
      <AbsoluteFill
        style={{
          alignItems: "flex-end",
          justifyContent: "flex-end",
          padding: theme.layout.safeMargin,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: theme.space[4],
          }}
        >
          <Callout variant="bad" delay={at("1:33")} from="right">
            not ignored
          </Callout>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: theme.space[2],
            }}
          >
            <Callout variant="good" delay={at("1:38")} from="right">
              local
            </Callout>
            {/* The pointer underlines the word the whole video turns on. */}
            <Caret delay={at("1:41")} underlineWidth={132} underlineAt={at("1:42")} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Keeps the VO line for this scene's opening beat next to the code that animates it. */
export const OPENS_ON = BEATS.flatModel.vo;
