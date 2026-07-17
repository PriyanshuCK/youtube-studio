# WebBraces — Project Guide (for Claude Code)

WebBraces is an educational YouTube channel: visually beautiful, motion-graphics-first explainers
about web development (CSS/JS), built in **Remotion**. This folder is both the **brain**
(brand, pipeline, video briefs) and the **code monorepo**.

## Who / what
- **Audience:** intermediate developers who use a feature but don't understand the mechanism.
- **Goal (first 6 months):** authority — a small library of *definitive* short explainers.
- **Format:** 4–8 min, single concept each, Hook → Clarify → Reinforce → Close.
- **Voice:** creator's own (AI/ElevenLabs as fallback so nothing blocks shipping).
- **Creator:** 3–4 yrs CSS/SVG/JS/TS/React/Next; new to Remotion (not a bottleneck — Claude Code writes components). Uses **Bun**.

## Repo layout (monorepo, Bun workspaces)
```
youtube-studio/
├── package.json            # workspace root: "workspaces": ["packages/*", "videos/*"]
├── packages/
│   └── design-system/      # tokens + reusable Remotion components (source of truth)
├── videos/
│   └── NNN-slug/           # one Remotion project per video, imports design-system
├── docs/
│   ├── brand/              # WebBraces-Design-System.md + design-system.html
│   ├── pipeline/           # PIPELINE.md (stages, quality bar, templates)
│   └── videos/NNN-slug/    # brief, script, storyboard per video
└── CLAUDE.md
```

## Conventions
- **Never hardcode** color/spacing/easing — import from `packages/design-system` tokens.
- Tokens & motion values are defined in `docs/brand/WebBraces-Design-System.md` (authoritative).
- Custom easings only (`ease/out`, `ease/inout`, `ease/soft`); never a default linear reveal.
- Nothing animates from `scale(0)`; enter from `scale(0.95)` + opacity.
- Every animation must have an identifiable purpose and sync to the narration beat.
- New video = copy a `videos/_template/` project, add its `docs/videos/NNN-slug/` brief.

## Design-system components to build first
`Theme`, `BraceFrame`, `Intro`/`Outro`, `CodeBlock`, `LineHighlight`, `Caret`, `Callout`,
`StepReveal`, `Diagram` primitives, `LowerThird`, `Transition`.

## Next actions
1. Scaffold the Bun monorepo (root `package.json`, `packages/design-system`, `videos/_template`).
2. Implement `Theme` + tokens, then `BraceFrame` and `CodeBlock`.
3. Build video 001 (z-index / stacking contexts) as the reference implementation.
