# Video 001 — Script (word-for-word VO)

**Runtime target:** ~5 min · **Structure:** Hook → Clarify → Reinforce → Close
Format: `VO line` on the left; **[visual]** cues for the storyboard on the right.
Takeaway: *z-index is local — it sorts within a stacking context, not across the whole page.*

---

## HOOK  (0:00–0:20)

> You set `z-index` to nine-thousand-nine-hundred-ninety-nine. And the element… still won't come to the front.

**[visual]** A modal/card sits stubbornly *behind* a header. The number `z-index: 9999` stamps on in brace-gold, then a coral ✕ flicks over it. Caret blinks.

> So you go higher. Nothing. You start questioning your career.

**[visual]** The number ticks up — 9999 → 99999 → 999999 — element doesn't move. Quiet beat.

> Here's the thing nobody tells you: z-index isn't a global ranking. And once you see *why*, it will never confuse you again.

**[visual]** BraceFrame closes around the title **"Why z-index doesn't work"**, then opens.

---

## CLARIFY  (0:20–3:00)

> First, the setup most people carry in their head. They picture the page as one big stack — every element assigned a number, highest number on top.

**[visual]** A single flat tower of layers, each tagged with a number, sorted top-to-bottom. Clean, tempting… and wrong.

> That model is the problem. Because the page isn't one stack. It's a *tree* of stacks. We call each one a **stacking context.**

**[visual]** The single tower splits into two separate towers side by side. Label fades in: *stacking context*. (Definition arrives after the picture.)

> A stacking context is a self-contained world for layering. Inside it, z-index does exactly what you expect — it sorts the elements *in that world*, highest on top.

**[visual]** Zoom into one tower; three gold elements re-order by their z-index numbers. Satisfying.

> But — and this is the whole video — z-index only sorts elements **within the same context.** It cannot lift a child out of its context and into another one.

**[visual]** A gold element climbs to the very top of its own *short* tower… and is still below the *base* of the taller tower beside it. The "aha" frame. Hold it.

> So your `9999`? It made your element the king… of a context that itself sits near the floor. The number's not being ignored. It's just local.

**[visual]** Callout: coral ✕ "not ignored" → mint ✓ "local". Caret underlines *local*.

> Now the real question: how did your element get trapped in a low context in the first place? You almost never create one on purpose.

**[visual]** StepReveal list builds, one line per beat.

> A stacking context is created by things you use every day. A `transform`. An `opacity` less than one. A `filter`. `will-change`. `isolation: isolate`. And a positioned element with any z-index at all.

**[visual]** Each property drops into the list in brace-gold as it's named; a faint tower forms behind each one.

> So the moment a parent has, say, `transform: translateZ(0)` — a super common performance trick — that parent becomes a context. And everything inside it is now sealed in. Your child's z-index can climb all it wants; it can't escape the parent.

**[visual]** Parent box gets a `transform`; a translucent "context boundary" snaps around it, trapping the gold child inside. Child z-index spins up to 9999 — stays put.

---

## REINFORCE  (3:00–4:20)

> Let's fix the exact bug you came here with.

**[visual]** Split screen: the broken UI from the hook returns on the left; code panel on the right.

> Your dropdown is `z-index: 9999`, but it's rendering behind the sidebar. You inspect the parent… and there it is: the parent has `opacity: 0.98`. That one line created a stacking context, and it's sitting below the sidebar's context.

**[visual]** CodeBlock; LineHighlight brackets `opacity: 0.98` in gold. The two context towers appear; parent's tower is clearly lower.

> Two ways out. One: remove what created the context — drop the opacity, or the transform — if you don't need it. The child rejoins the higher context and your z-index works again.

**[visual]** `opacity` line fades out; context boundary dissolves; dropdown pops to the front. Mint ✓.

> Two — the better fix — stop fighting it. Promote the *right* ancestor. Put the dropdown, or a shared parent, into a context that you *control*, high in the tree, and order things there.

**[visual]** A shared parent lifts to the top tower; dropdown rides up with it. Deliberate, calm.

> The lesson isn't "use bigger numbers." It's "know which context you're in."

**[visual]** The two-tower diagram, now labelled and orderly.

---

## CLOSE  (4:20–4:45)

> So here's the whole thing in one line: **z-index is local. It sorts within a stacking context — not across the page.**

**[visual]** BraceFrame closes around the takeaway line, gold on ink.

> Next time an element won't come forward, don't reach for a bigger number. Find the context. That's the fix.

**[visual]** Caret blinks after the line.

> I'm making a whole series pulling back the curtain on the stuff you use but never see. If that's your kind of thing — you know what to do.

**[visual]** Outro: `{ WebBraces }` wordmark, subscribe cue, next-video card.
