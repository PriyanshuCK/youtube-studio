# WebBraces — Production Pipeline

Every video moves through these seven stages. Each stage has a **deliverable** and a
**quality bar** it must clear before the next stage starts. Excellence is a property of clearing
the bar every time — not of working harder on any one video.

Folder per video: `docs/videos/NNN-slug/` holds the brief, script, and storyboard;
the Remotion project lives in `videos/NNN-slug/`.

---

## Stage 1 — Idea
**Deliverable:** one line — *"the confusing thing this video makes click"* + who it's for + why now.
**Quality bar:**
- [ ] Targets the intermediate "I use it but don't truly get it" developer.
- [ ] There is a real, nameable misconception the video corrects.
- [ ] It has an obvious visual (the mechanism can be *shown*, not just told).

## Stage 2 — Title & Thumbnail (do this BEFORE scripting)
**Deliverable:** 3–5 title candidates + 2 thumbnail directions.
**Why first:** if you can't package it compellingly, the topic isn't ready — find out now, not after 20 hours.
**Quality bar:**
- [ ] Title names the pain or the surprise ("Why z-index doesn't work"), not the syllabus ("z-index tutorial").
- [ ] Thumbnail is legible at small size, uses brand tokens, one focal idea, brace-gold accent.
- [ ] Title + thumbnail don't repeat each other — they combine.

## Stage 3 — Concept / Angle
**Deliverable:** the single mental model the video installs, + the one "definition-last" picture that makes it inevitable.
**Quality bar:**
- [ ] Exactly one core mental model (not three).
- [ ] The "aha" is identifiable in a sentence.
- [ ] You can name the final image the viewer should leave with.

## Stage 4 — Script (word-for-word voiceover)
**Deliverable:** full VO script, structured **Hook → Clarify → Reinforce → Close**.
**Quality bar:**
- [ ] Hook lands in the first 5–10 seconds (a question, a broken expectation, a promise).
- [ ] One idea per beat; nothing introduced two-at-a-time.
- [ ] The definition arrives *after* the picture, never before.
- [ ] Read aloud: no sentence is hard to say or hard to follow.
- [ ] Close restates the one takeaway in a single line.

## Stage 5 — Storyboard
**Deliverable:** each script beat → a shot: component, animation, what's on screen, on-screen text.
**Quality bar:**
- [ ] Every beat maps to a visual that *says the same thing the words say*.
- [ ] Every animation has an identifiable purpose (3B1B covenant).
- [ ] Uses design-system components; no bespoke one-offs unless justified.
- [ ] One focal point per frame; reading order is deliberate.

## Stage 6 — Animate (Remotion)
**Deliverable:** rendered video, no audio yet.
**Quality bar:**
- [ ] Only design-system tokens/components (no hardcoded hex, no default easings).
- [ ] Reveals staggered; nothing animates from scale(0); payoff frames hold long enough to read.
- [ ] Reviewed next-day / in slow motion for timing glitches.

## Stage 7 — Record VO → Assemble → Polish → Publish
**Deliverable:** final upload + title, thumbnail, description, chapters, end screen.
**Quality bar:**
- [ ] Audio synced to animation beats.
- [ ] Captions styled from brand tokens.
- [ ] End screen / CTA present.
- [ ] Passes a final full watch with fresh eyes.

---

## Templates

### Title candidates
```
1. Why <thing> doesn't work
2. <thing>, explained visually
3. The mental model for <thing>
4. <surprising claim about thing>
5. <thing> finally makes sense
```

### Script skeleton
```
[HOOK]        (0:00–0:10)  Break an expectation. Promise the payoff.
[CLARIFY]     Build the mental model one beat at a time. Picture, then name.
[REINFORCE]   Apply it to the exact case the viewer hits in real life.
[CLOSE]       One-line takeaway. Subtle CTA.
```

### Storyboard row
```
| Beat # | VO line | Component | Animation | On-screen text | Focus color |
```
