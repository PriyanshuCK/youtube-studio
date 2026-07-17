import { layout } from "@webbraces/design-system";
import React from "react";
import { Composition } from "remotion";
import { TOTAL_FRAMES } from "./beats";
import { Video } from "./Video";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="ZIndexStackingContexts"
    component={Video}
    durationInFrames={TOTAL_FRAMES}
    fps={layout.fps}
    width={layout.frame.width}
    height={layout.frame.height}
  />
);
