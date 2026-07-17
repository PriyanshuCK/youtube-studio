import React from "react";
import { Sequence } from "remotion";
import { BEATS, SCENES, frames, type SceneId } from "./beats";

export type SceneProps = {
  id: SceneId;
  children: React.ReactNode;
};

/** The VO line that opens a scene — used to name it on the Studio timeline. */
const openingLine = (id: SceneId): string => {
  const beat = Object.values(BEATS).find((b) => b.at === SCENES[id].from);
  return beat ? beat.vo : "";
};

/**
 * A scene, timed from `beats.ts`.
 *
 * The Sequence is named with the VO line it opens on, so the Studio timeline reads as the
 * script rather than as a list of frame ranges — which is what makes it possible to check the
 * animation against the narration without leaving the browser.
 */
export const Scene: React.FC<SceneProps> = ({ id, children }) => {
  const { from, to } = SCENES[id];
  const line = openingLine(id);

  return (
    <Sequence
      name={`${from} ${id} — “${line.slice(0, 60)}${line.length > 60 ? "…" : ""}”`}
      from={frames(from)}
      durationInFrames={frames(to) - frames(from)}
    >
      {children}
    </Sequence>
  );
};
