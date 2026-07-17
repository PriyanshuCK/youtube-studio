# WebBraces — Design System (v0.1 draft)

> The channel that makes the confusing thing finally click.
> Educational web-dev videos (CSS/JS), made in Remotion, motion-graphics-first.
> Audience: the **intermediate developer** who uses a feature but doesn't truly understand the mechanism.

This document is the single source of truth for how every WebBraces video looks, moves, and
feels. Every video composes from these tokens; nothing is designed from scratch twice.

---

## 0. Brand thesis

**The name is the concept.** Braces `{ }` are the containers of code — the boundary between
"the thing" and "what's inside it." WebBraces is about what's *inside* the braces: the hidden
mechanism most developers never see. So the brace is not a logo decoration — it's the channel's
**framing and reveal device**. Concepts are enclosed by braces, then opened.

**One signature, everything else quiet.** (Emil Kowalski / Chanel's rule.) We spend our boldness
on the animated brace-frame motif and the reveal moment. Everything around it — type, color,
layout — stays disciplined so the signature reads.

---

## ✳ Principles we design by (read this first)

These are the rules every frame and every animation must obey. They come from the classical
animation canon, Gestalt psychology, information-design research, and the best educational
channels. If a shot violates one of these, it doesn't ship.

### A. Clarity is the product
- **One idea per moment.** Each beat of narration = one new thing on screen. Never introduce two
  concepts in the same breath. Complexity is revealed *sequentially*, never dumped.
- **Progressive disclosure.** Build a diagram piece by piece as you talk about each piece. The
  viewer should never see a finished-but-unexplained diagram and have to reverse-engineer it.
- **Reduce cognitive load.** Remove everything non-essential from the frame. Whitespace (negative
  space) is not empty — it's what lets the eye find the focal point. Fewer prominent "chunks" =
  deeper retention.
- **Encode meaning with position and length first**, color and shape second. The eye reads
  *where* and *how big* faster than *what color*.

### B. Direct the eye (staging + hierarchy)
- **One focal point per frame.** Use size, contrast, and our single focus color (gold = "the
  point", cyan = "look here now") to make it unambiguous what to look at. Never two things
  shouting at once.
- **Staging (from the 12 principles):** compose, light, and position so the idea is instantly
  legible. The frame's job is to make the current point *unmissable*.
- **Rule of thirds / off-center focus** for title and hero moments; dead-center only for the final
  payoff.

### C. Group with Gestalt
- **Proximity & common region:** related elements sit close together / inside a shared container
  (a braced region). Distance and dividers say "these are different things."
- **Similarity:** same color/shape = same kind of thing. Consistency across videos means viewers
  learn our visual grammar once (gold brace = mechanism, coral = the wrong way, mint = the right
  way) and read every future video faster.
- **Continuity:** arrows and motion paths lead the eye along the logical flow of the explanation.

### D. Motion that feels alive (the 12 principles, distilled for explainers)
- **Slow in / slow out (easing).** Nothing moves at constant velocity except deliberate constant
  motion (a scan line). This is the single biggest "amateur vs. pro" tell — see easing tokens.
- **Anticipation.** A tiny wind-up before a big move tells the viewer something is about to happen,
  so they don't miss it. A brace that pulls back slightly before sweeping in.
- **Squash & stretch (with conserved volume).** Gives objects weight and life; a dropped element
  compresses on landing. Use sparingly, for personality on emphasis moments — never on code.
- **Follow-through & overlap.** Elements don't all stop dead at once; secondary parts settle a beat
  later. This is what makes motion feel physical rather than mechanical.
- **Arcs.** Natural movement follows curved paths, not straight lines.
- **Secondary action & stagger.** Supporting motion (a caret blink, a label fade) reinforces the
  main action; staggering reveals 60–120ms apart sets reading order.
- **Exaggeration for emphasis.** When a point matters, push the scale/timing past realism so it
  lands — restraint everywhere else makes the exaggerated moment read.

### E. The 3Blue1Brown covenant (most important)
- **Every movement is deliberate and has an identifiable purpose.** If you can't say why something
  moves, it doesn't move.
- **Visual and narration say the same thing at the same instant** — they reinforce, never compete.
- **The definition is the ending point, not the start.** Show the picture that makes the idea
  inevitable, *then* name it.

---

## 1. Color

Rationale: code lives on dark, but we avoid the two AI-default dark looks (pure-black + single
acid-green; and the flat #000 dashboard). Our background is a **deep ink navy**, not black — it
photographs better under video compression (pure black crushes; saturated colors on pure black
chroma-bleed). The signature accent is **warm brace-gold**, which is deliberately *not* the
blue/green every dev channel uses — it reads premium and is unmistakably ours.

### Primitive tokens (raw values)

| Token | Hex | Use |
|---|---|---|
| `ink-900` | `#0C1018` | Primary background |
| `ink-800` | `#121826` | Elevated surface / code panel |
| `ink-700` | `#1B2334` | Panel border / hairlines |
| `ink-600` | `#2A3448` | Muted dividers |
| `paper-50` | `#F2F5FB` | Primary text (off-white, never pure #FFF) |
| `paper-300` | `#AEB7C9` | Secondary text |
| `paper-500` | `#6E7893` | Muted / captions |
| `gold-400` | `#F5C56B` | **Signature accent** — braces, highlights, brand |
| `gold-600` | `#C99A3E` | Gold pressed / deep |
| `cyan-400` | `#5EC8FF` | Secondary accent — pointers, "look here" |
| `coral-400` | `#FF7A6B` | Alert / "the wrong way" / diff-removed |
| `mint-400` | `#63E6A8` | Success / "the right way" / diff-added |

### Semantic tokens (what you actually reference)

| Semantic | → Primitive | Meaning |
|---|---|---|
| `bg/base` | `ink-900` | Scene background |
| `bg/panel` | `ink-800` | Code blocks, cards |
| `text/primary` | `paper-50` | Headlines, body |
| `text/muted` | `paper-500` | Labels, captions |
| `accent/brand` | `gold-400` | The brace, emphasis, channel identity |
| `accent/focus` | `cyan-400` | Directs the eye to the current element |
| `state/bad` | `coral-400` | Anti-pattern, error, before |
| `state/good` | `mint-400` | Correct pattern, after |

**Discipline rule:** a frame may show **one** focus color at a time. Gold = "this is the point."
Cyan = "look here now." Never both fighting for attention in the same moment.

### Syntax palette (for code on screen)
A curated highlight theme harmonized with the brand (keywords gold, strings mint, functions cyan,
comments muted) so code and motion graphics feel like one design, not a screenshot pasted in.
Defined separately in `code-theme.md`.

---

## 2. Typography

Rationale: display face carries personality; body face stays neutral and legible at video
compression; mono is chosen specifically for **1080p readability**, where JetBrains Mono's tall
x-height beats Fira Code when the viewer is squinting at compressed video.

| Role | Face | Weight | Notes |
|---|---|---|---|
| Display / titles | **Clash Display** | 600 | Editorial, distinctive; used large, with restraint |
| Body / labels | **Satoshi** | 400 / 500 | Neutral, humanist, highly legible |
| Code | **JetBrains Mono** | 400 / 700 | Chosen for compressed-video readability; ligatures on |

(All three are free — Fontshare + JetBrains. Swap candidates noted at bottom.)

### Type scale (video is viewed at distance — bias large)
Ratio 1.25 (major third). Base = 32px at 1080p.

| Token | px @1080p | Use |
|---|---|---|
| `type/display` | 96 | Title cards |
| `type/h1` | 64 | Section headers |
| `type/h2` | 48 | Sub-points |
| `type/body` | 32 | Narrated on-screen text |
| `type/code` | 30 | Code (line-height 1.5) |
| `type/caption` | 24 | Labels, footnotes |

Line-height: 1.14 for display/headings, 1.5 for body and code.

---

## 3. Spacing & layout

8px base grid (all spacing is a multiple of 8). Composition tokens:

| Token | px | Use |
|---|---|---|
| `space/1`…`space/8` | 8, 16, 24, 32, 48, 64, 96, 128 | Gaps, padding |
| `safe/margin` | 96 | Title-safe margin from frame edge (1920×1080) |
| `radius/panel` | 16 | Code panels, cards |
| `radius/pill` | 999 | Labels, tags |
| `hairline` | 1.5 | Panel borders (`ink-700`) |

Composition defaults: content lives inside the 96px safe margin; code panels get 32px internal
padding; a persistent baseline grid keeps every scene aligned so cuts don't jitter.

---

## 4. Motion language

This is where the channel wins or loses. Grounded in three sources: 3Blue1Brown (deliberate,
narration-synced motion), classical animation (slow-in/slow-out), and Emil Kowalski (custom easing,
never scale-from-zero).

### Core rules
1. **Every motion has a purpose** and communicates the same point as the narration at that instant.
2. **Nothing appears from nothing** — enter from `scale(0.95)` + `opacity 0`, never `scale(0)`.
3. **Stagger to set reading order** — reveal elements 60–120ms apart so the eye knows what's first.
4. **Motion tracks meaning** — things that are *related* move together; things being *contrasted*
   separate. Morph one state into another rather than cut, so the viewer follows the transformation.
5. **Hold after reveal.** In video (unlike UI) the payoff frame must breathe — let the finished
   state sit long enough to read.

### Easing tokens
| Token | Curve | Use |
|---|---|---|
| `ease/out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Entrances (decisive stop) |
| `ease/inout` | `cubic-bezier(0.77, 0, 0.175, 1)` | On-screen morphs / moves |
| `ease/soft` | `cubic-bezier(0.32, 0.72, 0, 1)` | Gentle, elegant reveals |
| `linear` | — | Constant motion (progress, scanning a line of code) |

Never `ease-in` for entrances (feels sluggish at the exact moment the viewer is watching).

### Duration tokens (video timing, longer than UI)
| Token | ms | Use |
|---|---|---|
| `dur/quick` | 250 | Label pops, small emphasis |
| `dur/base` | 450 | Standard element reveal |
| `dur/move` | 650 | Morphs, repositioning |
| `dur/scene` | 900+ | Big conceptual transformations |

Tie all of these to narration beats, not arbitrary counts — animation is blocked to the voiceover
first, then eased.

---

## 5. Signature system (the memorable thing)

**The Brace Frame.** Two gold braces `{` `}` are the channel's recurring device:
- **Intro:** braces sweep in from left/right and close around the video title.
- **Section markers:** each concept is introduced *inside* braces, then the braces open outward to
  reveal the explanation — literally "opening up" the mechanism.
- **Emphasis:** a single gold brace can bracket one line of code to say "this is the part that
  matters."
- **Outro:** braces close back around a one-line takeaway.

Supporting motif: a **gold text caret** `|` that acts as the channel's "pointer" — it leads the
eye, blinks at rest, and slides to whatever we're talking about (a cheaper, more intimate version
of a laser pointer, and it's on-brand for a text-editor channel).

Everything else stays quiet so these read.

---

## 6. Reusable component inventory (to build once in `packages/design-system`)

| Component | Purpose |
|---|---|
| `<BraceFrame>` | The signature open/close brace reveal |
| `<Intro>` / `<Outro>` | Standard title + takeaway bookends |
| `<CodeBlock>` | Themed, animatable code with line-focus + typing |
| `<LineHighlight>` | Gold-brace / glow emphasis on specific code lines |
| `<Caret>` | The pointer motif |
| `<Callout>` | Bad/good annotation (coral/mint) |
| `<StepReveal>` | Staggered list/diagram reveal |
| `<Diagram>` primitives | Boxes, arrows, morph transitions for mechanism visuals |
| `<LowerThird>` | Consistent labels/name tags |
| `<Transition>` | Standard scene-to-scene (brace wipe / soft push) |
| `<Theme>` | Provider exposing all tokens above |

---

## 7. Accessibility / quality floor
- Text contrast ≥ 4.5:1 against its background (paper-50 on ink-900 passes comfortably).
- Never rely on color alone for good/bad — pair with the brace/caret and position.
- Captions/subtitles styled from the same tokens (Satoshi 500, ink-800 pill).

---

## Swap candidates (if we want to revise)
- Display: General Sans, Boska, Hanken Grotesk (if Clash Display feels too trendy).
- Accent: swap brace-gold for warm coral `#FF7A6B` as primary if you want more energy (but gold is
  the more distinctive choice against the dev-channel field).

## Open decisions (to confirm with Priyanshu)
1. Gold as the signature accent — yes, or push toward coral/electric?
2. Clash Display for titles — keep, or try a less-trendy display face?
3. Light-mode variant ever needed (e.g. thumbnails), or dark-only?
