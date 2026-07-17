import {
  LayerStack,
  StepReveal,
  useEnter,
  useTheme,
  type StepItem,
} from "@webbraces/design-system";
import React from "react";
import { AbsoluteFill } from "remotion";
import { BEATS, sceneAt } from "../beats";

const at = sceneAt("whatCreates");

/** Each property lands on the word that names it. */
const CAUSES: { code: string; at: string }[] = [
  { code: "transform", at: "2:05" },
  { code: "opacity < 1", at: "2:08" },
  { code: "filter", at: "2:11" },
  { code: "will-change", at: "2:13.5" },
  { code: "isolation: isolate", at: "2:16" },
  { code: "position + any z-index", at: "2:19" },
];

/**
 * CLARIFY, 1:47–2:25 — what actually creates a context.
 *
 * The list is the focal point, so the tower behind it stays faint and still. The temptation was
 * to give every property its own animated tower; six towers competing is six focal points, which
 * is none. The tower is here only to answer "one of *what*?" — it earns its place by being quiet.
 */
export const WhatCreates: React.FC = () => {
  const theme = useTheme();

  const heading = useEnter({ delay: at("1:48"), easing: theme.ease.soft, from: "left" });
  const lead = useEnter({ delay: at("2:01"), easing: theme.ease.soft });

  const items: StepItem[] = CAUSES.map((cause) => ({
    at: at(cause.at),
    content: (
      <span
        style={{
          ...theme.text.code,
          fontSize: theme.size.body,
          color: theme.color.accent.brand,
        }}
      >
        {cause.code}
      </span>
    ),
  }));

  return (
    <AbsoluteFill style={{ padding: theme.layout.safeMargin }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.space[4],
          maxWidth: 900,
          justifyContent: "center",
          height: "100%",
        }}
      >
        <h2
          style={{
            ...theme.text.h2,
            margin: 0,
            opacity: heading.opacity,
            scale: heading.scale,
            translate: heading.translate,
          }}
        >
          You almost never create one on purpose.
        </h2>

        <span
          style={{
            ...theme.text.caption,
            color: theme.color.text.muted,
            opacity: lead.opacity,
          }}
        >
          A stacking context is created by:
        </span>

        <StepReveal items={items} gap={theme.space[3]} focusLatest />
      </div>

      {/* What all six of them make. Faint and static — the list is the point. */}
      <div style={{ position: "absolute", right: 220, bottom: 380, opacity: 0.4 }}>
        <LayerStack
          width={300}
          layerHeight={56}
          delay={at("2:04")}
          slots={3}
          layers={[
            { id: "c", label: "child", slot: 0, delay: at("2:04") },
            { id: "b", label: "child", slot: 1, delay: at("2:04.1") },
            { id: "a", label: "child", slot: 2, variant: "brand", delay: at("2:04.2") },
          ]}
          boundary={{ label: "stacking context", at: at("2:05") }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const OPENS_ON = BEATS.howTrapped.vo;
