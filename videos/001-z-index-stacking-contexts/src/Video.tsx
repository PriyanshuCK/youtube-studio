import { Theme } from "@webbraces/design-system";
import React from "react";
import { AbsoluteFill } from "remotion";
import { Scene } from "./Scene";
import { Close } from "./scenes/Close";
import { Contexts } from "./scenes/Contexts";
import { HookStuck } from "./scenes/HookStuck";
import { HookTitle } from "./scenes/HookTitle";
import { TheBug } from "./scenes/TheBug";
import { TheFix } from "./scenes/TheFix";
import { TheLesson } from "./scenes/TheLesson";
import { TheTrap } from "./scenes/TheTrap";
import { WhatCreates } from "./scenes/WhatCreates";

/**
 * Video 001 — Why z-index doesn't work.
 *
 * Hook → Clarify → Reinforce → Close, timed against `beats.ts`, which is a transcription of
 * `docs/videos/001-z-index-stacking-contexts/script.md`.
 *
 * No audio yet (stage 6 ships picture-only). Each scene starts on the frame its VO line starts
 * on, so recording the voiceover is a drop-in: nothing below has to be re-timed.
 */
export const Video: React.FC = () => (
  <Theme>
    <AbsoluteFill>
      <Scene id="hookStuck">
        <HookStuck />
      </Scene>
      <Scene id="hookTitle">
        <HookTitle />
      </Scene>
      <Scene id="contexts">
        <Contexts />
      </Scene>
      <Scene id="whatCreates">
        <WhatCreates />
      </Scene>
      <Scene id="theTrap">
        <TheTrap />
      </Scene>
      <Scene id="theBug">
        <TheBug />
      </Scene>
      <Scene id="theFix">
        <TheFix />
      </Scene>
      <Scene id="theLesson">
        <TheLesson />
      </Scene>
      <Scene id="close">
        <Close />
      </Scene>
    </AbsoluteFill>
  </Theme>
);
