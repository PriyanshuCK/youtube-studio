import { layout, parseTimecode } from "@webbraces/design-system";

/**
 * The script, as timing data.
 *
 * Every VO line from `docs/videos/001-z-index-stacking-contexts/script.md` with the timecode it
 * lands on. Animation is blocked to the voiceover first, then eased — so this file is the thing
 * the whole video is timed against, and it is diffable against the script by eye.
 *
 * Audio is not in the composition yet. When the VO is recorded, each line drops onto its beat
 * and nothing below has to move.
 */
export const BEATS = {
  // ── HOOK ──────────────────────────────────────────────────────────────────────
  hookSet: {
    at: "0:00",
    vo: "You set z-index to nine-thousand-nine-hundred-ninety-nine. And the element… still won't come to the front.",
  },
  hookHigher: {
    at: "0:07",
    vo: "So you go higher. Nothing. You start questioning your career.",
  },
  hookReveal: {
    at: "0:13",
    vo: "Here's the thing nobody tells you: z-index isn't a global ranking. And once you see why, it will never confuse you again.",
  },

  // ── CLARIFY ───────────────────────────────────────────────────────────────────
  flatModel: {
    at: "0:20",
    vo: "First, the setup most people carry in their head. They picture the page as one big stack — every element assigned a number, highest number on top.",
  },
  treeOfStacks: {
    at: "0:34",
    vo: "That model is the problem. Because the page isn't one stack. It's a tree of stacks. We call each one a stacking context.",
  },
  selfContained: {
    at: "0:47",
    vo: "A stacking context is a self-contained world for layering. Inside it, z-index does exactly what you expect — it sorts the elements in that world, highest on top.",
  },
  onlyWithin: {
    at: "1:05",
    vo: "But — and this is the whole video — z-index only sorts elements within the same context. It cannot lift a child out of its context and into another one.",
  },
  kingOfTheFloor: {
    at: "1:30",
    vo: "So your 9999? It made your element the king… of a context that itself sits near the floor. The number's not being ignored. It's just local.",
  },
  howTrapped: {
    at: "1:47",
    vo: "Now the real question: how did your element get trapped in a low context in the first place? You almost never create one on purpose.",
  },
  createdBy: {
    at: "2:00",
    vo: "A stacking context is created by things you use every day. A transform. An opacity less than one. A filter. will-change. isolation: isolate. And a positioned element with any z-index at all.",
  },
  sealedIn: {
    at: "2:25",
    vo: "So the moment a parent has, say, transform: translateZ(0) — a super common performance trick — that parent becomes a context. And everything inside it is now sealed in. Your child's z-index can climb all it wants; it can't escape the parent.",
  },

  // ── REINFORCE ─────────────────────────────────────────────────────────────────
  fixTheBug: {
    at: "3:00",
    vo: "Let's fix the exact bug you came here with.",
  },
  theOpacityLine: {
    at: "3:06",
    vo: "Your dropdown is z-index: 9999, but it's rendering behind the sidebar. You inspect the parent… and there it is: the parent has opacity: 0.98. That one line created a stacking context, and it's sitting below the sidebar's context.",
  },
  wayOut1: {
    at: "3:30",
    vo: "Two ways out. One: remove what created the context — drop the opacity, or the transform — if you don't need it. The child rejoins the higher context and your z-index works again.",
  },
  wayOut2: {
    at: "3:52",
    vo: "Two — the better fix — stop fighting it. Promote the right ancestor. Put the dropdown, or a shared parent, into a context that you control, high in the tree, and order things there.",
  },
  theLesson: {
    at: "4:12",
    vo: "The lesson isn't 'use bigger numbers.' It's 'know which context you're in.'",
  },

  // ── CLOSE ─────────────────────────────────────────────────────────────────────
  takeaway: {
    at: "4:20",
    vo: "So here's the whole thing in one line: z-index is local. It sorts within a stacking context — not across the page.",
  },
  findTheContext: {
    at: "4:32",
    vo: "Next time an element won't come forward, don't reach for a bigger number. Find the context. That's the fix.",
  },
  series: {
    at: "4:38",
    vo: "I'm making a whole series pulling back the curtain on the stuff you use but never see. If that's your kind of thing — you know what to do.",
  },
} as const;

export type BeatId = keyof typeof BEATS;

/** Script runtime. The Close runs ~7s past its last line to let the outro breathe. */
export const RUNTIME = "4:45";

/**
 * Scenes are cut where the *picture* changes, which is not always where a beat starts.
 *
 * `contexts` is one 87-second scene on purpose: the flat tower, the split, the sort, and the
 * aha are all the same objects moving. Cutting between them would make the viewer re-establish
 * the diagram four times and lose the thread that the two towers *are* the one tower.
 */
export const SCENES = {
  hookStuck: { from: BEATS.hookSet.at, to: BEATS.hookReveal.at },
  hookTitle: { from: BEATS.hookReveal.at, to: BEATS.flatModel.at },
  contexts: { from: BEATS.flatModel.at, to: BEATS.howTrapped.at },
  whatCreates: { from: BEATS.howTrapped.at, to: BEATS.sealedIn.at },
  theTrap: { from: BEATS.sealedIn.at, to: BEATS.fixTheBug.at },
  theBug: { from: BEATS.fixTheBug.at, to: BEATS.wayOut1.at },
  theFix: { from: BEATS.wayOut1.at, to: BEATS.theLesson.at },
  theLesson: { from: BEATS.theLesson.at, to: BEATS.takeaway.at },
  close: { from: BEATS.takeaway.at, to: RUNTIME },
} as const;

export type SceneId = keyof typeof SCENES;

export const frames = (timecode: string) => Math.round(parseTimecode(timecode) * layout.fps);

export const TOTAL_FRAMES = frames(RUNTIME);

/**
 * Turns an absolute script timecode into a delay in ms from the start of a scene.
 *
 * Components take ms delays; the script speaks in timecodes. This is the seam between them, so
 * a scene reads `delay={at(BEATS.onlyWithin.at)}` and can be checked against script.md directly.
 */
export const sceneAt =
  (scene: SceneId) =>
  (timecode: string): number =>
    (parseTimecode(timecode) - parseTimecode(SCENES[scene].from)) * 1000;
