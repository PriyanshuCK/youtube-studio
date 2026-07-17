# Video 001 — Why z-index doesn't work

## Stage 1 — Idea
**The confusing thing:** developers set a huge `z-index` and the element *still* won't come to the
front — because `z-index` only works *within a stacking context*, and they've accidentally created
one (or aren't in the one they think).
**For:** the intermediate dev who has fought a `z-index: 9999` that did nothing.
**Why now:** evergreen, high-search, universally painful — a perfect debut.

## Stage 2 — Title & Thumbnail (draft)
**Title candidates:**
1. Why z-index doesn't work
2. z-index: 9999 won't save you
3. The real reason z-index is ignored
4. Stacking contexts, explained visually
5. z-index finally makes sense

**Thumbnail directions:**
- **A — the failed layer.** A UI card stuck *behind* another, a giant `z-index: 9999` label in
  brace-gold with a coral ✕. Dark ink background. Reads the pain instantly.
- **B — layers in 3D.** Exploded 3D stack of translucent layers (Remotion depth), one glowing gold
  layer trapped inside a boxed "context." One focal point, brand-forward.

## Stage 3 — Concept / Angle
**Mental model:** the page isn't one flat stack of z-indexes — it's a *tree of stacking contexts*.
`z-index` only sorts siblings **inside the same context**; a child of a lower context can never
rise above an element in a higher one, no matter how big its z-index.
**Definition-last picture:** show two "towers" (contexts) side by side; a gold element climbs to the
top of its own short tower but is still below the *base* of the taller tower — the "aha" that a
local z-index can't escape its context.
**One takeaway:** *z-index is local. It sorts within a stacking context, not across the whole page.*

## Next step
→ Stage 4: write the word-for-word Hook → Clarify → Reinforce → Close script.
(Say the word and I'll draft it.)
