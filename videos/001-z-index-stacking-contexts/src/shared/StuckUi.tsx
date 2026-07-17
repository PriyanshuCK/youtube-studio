import { Box, useEnter, useTheme } from "@webbraces/design-system";
import React from "react";

export type StuckUiProps = {
  /**
   * 0→1, driven by the scene. At 1 the parent's opacity is back to 1, the stacking context it
   * created is gone, and the dropdown genuinely jumps in front. This is "way out #1", live.
   */
  freed?: number;
  opacity?: number;
  /** ms. */
  delay?: number;
};

const STAGE = { width: 860, height: 448 };
const SIDEBAR_WIDTH = 280;

/**
 * The viewer's actual bug, on screen.
 *
 * This is not a picture of the bug — it *is* the bug. `.dropdown` really does carry
 * `z-index: 9999`, `.sidebar` really does carry `z-index: 10`, and the dropdown really does
 * render behind it, because its parent really does have `opacity: 0.98` and that really does
 * create a stacking context. Chromium sorts these exactly as it would on the viewer's page.
 *
 * Faking it with DOM order would have been easier and would have been a lie — and the one thing
 * an explainer cannot afford is a demo that doesn't reproduce.
 */
export const StuckUi: React.FC<StuckUiProps> = ({ freed = 0, opacity = 1, delay = 0 }) => {
  const theme = useTheme();
  const entrance = useEnter({ delay, duration: theme.duration.base, easing: theme.ease.soft });

  return (
    <div
      style={{
        position: "relative",
        width: STAGE.width,
        height: STAGE.height,
        borderRadius: theme.radius.panel,
        border: `${theme.hairline}px solid ${theme.color.bg.border}`,
        backgroundColor: theme.alpha.base(0.55),
        overflow: "hidden",
        opacity: opacity * entrance.opacity,
        scale: entrance.scale,
      }}
    >
      {/* The parent. Below opacity 1 it is a stacking context, and the dropdown is sealed in. */}
      <div style={{ opacity: 0.98 + freed * 0.02 }}>
        <Box
          variant="brand"
          static
          style={{
            position: "absolute",
            top: 120,
            left: 160,
            width: 500,
            height: 230,
            zIndex: 9999,
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: theme.space[2],
            padding: theme.space[4],
            // The sidebar hides the dropdown's left 120px — that overlap is the bug, on screen.
            // The label has to clear it, or the viewer can't tell what they're looking at.
            paddingLeft: theme.space[8] + theme.space[2],
            // The jump to the front happens the instant opacity reaches 1 — a single frame, by
            // definition. The glow ramps ahead of it so the eye is already here when it lands.
            boxShadow: `0 0 ${theme.space[6] * freed}px ${theme.alpha.brand(0.45 * freed)}`,
          }}
        >
          <span style={{ ...theme.text.bodyMedium, color: "inherit" }}>.dropdown</span>
          <span
            style={{
              ...theme.text.code,
              fontSize: theme.size.caption,
              color: theme.alpha.brand(0.75),
            }}
          >
            z-index: 9999
          </span>
        </Box>
      </div>

      <Box
        variant="default"
        static
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: SIDEBAR_WIDTH,
          zIndex: 10,
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          gap: theme.space[2],
          padding: theme.space[4],
          borderRadius: 0,
          backgroundColor: theme.color.bg.panel,
        }}
      >
        <span style={{ ...theme.text.bodyMedium, color: theme.color.text.secondary }}>
          .sidebar
        </span>
        <span
          style={{
            ...theme.text.code,
            fontSize: theme.size.caption,
            color: theme.color.text.muted,
          }}
        >
          z-index: 10
        </span>
      </Box>
    </div>
  );
};

export const STUCK_UI_SIZE = STAGE;
