import React from "react";
import { Composition } from "remotion";
import { VIDEO } from "./constants";
import { Starter } from "./Starter";

/**
 * Every WebBraces video registers its compositions here.
 * Copy this folder to `videos/NNN-slug/` to start a new one (see CLAUDE.md).
 */
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Starter"
      component={Starter}
      durationInFrames={VIDEO.fps * 10}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  );
};
