import { Intro } from "@webbraces/design-system";
import React from "react";
import { BEATS, sceneAt } from "../beats";

const at = sceneAt("hookTitle");

/**
 * HOOK, 0:13–0:20 — the title.
 *
 * Braces close around the claim, hold it, then open outward and hand off to the explanation:
 * the channel's own device saying "here is the thing, now let's open it up".
 */
export const HookTitle: React.FC = () => (
  <Intro
    title="Why z-index doesn't work"
    eyebrow="WebBraces"
    delay={at("0:13.2")}
    openAt={at("0:18.3")}
  />
);

export const OPENS_ON = BEATS.hookReveal.vo;
