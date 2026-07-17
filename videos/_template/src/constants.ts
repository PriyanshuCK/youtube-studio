import { layout } from "@webbraces/design-system";

/** The channel's fixed delivery format. Never varies between videos. */
export const VIDEO = {
  width: layout.frame.width,
  height: layout.frame.height,
  fps: layout.fps,
} as const;
