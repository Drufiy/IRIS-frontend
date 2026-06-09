# IRIS Frontend Foundation

This document defines `M0` for IRIS: brand direction, visual system, messaging spine, and the shared principles that should carry from the website into the future desktop app.

## Product Positioning

IRIS is not a chatbot with a pretty shell. It is a `voice-first operating layer` for your computer.

Core idea:

- Speak naturally
- IRIS understands intent
- IRIS reasons over tasks
- IRIS takes action on your machine
- IRIS shows what it is doing in real time

Working positioning statement:

> IRIS is a voice-first AI operating layer that turns natural language into real system action across your desktop.

Short value proposition:

> Speak once. IRIS listens, thinks, remembers, and acts.

## Audience

Primary audiences:

1. Builders and power users
- developers
- students
- startup operators
- automation-heavy users

2. AI early adopters
- people already using assistants
- users who want a system-level assistant, not just a text box

3. Demo and community audience
- GitHub visitors
- potential contributors
- people evaluating the product visually before trying it

## Brand Traits

IRIS should feel:

- minimal, not empty
- technical, not sterile
- cinematic, not flashy
- trustworthy, not corporate
- futuristic, but grounded in real functionality

Avoid:

- generic SaaS gradients
- purple-on-white AI clichés
- overexplaining every section
- cluttered dashboards in the marketing site
- cartoonish “assistant” visuals

## Visual Direction

Chosen direction:

`Quiet sci-fi minimalism`

The site should feel like a calm machine interface: dark glass, precise typography, subtle motion, and moments of color used as signal rather than decoration.

Visual ingredients:

- deep charcoal and near-black base
- soft silver text hierarchy
- a single electric accent family derived from current IRIS states
- translucent panels and restrained glow
- large typography with strong negative space
- thin lines, grid hints, signal bars, scanning motion

## Brand Color System

These are the initial shared tokens for website and desktop.

```css
:root {
  --iris-bg: #07090d;
  --iris-bg-elevated: #0e1218;
  --iris-panel: rgba(16, 21, 29, 0.72);
  --iris-panel-strong: rgba(18, 24, 34, 0.9);
  --iris-text: #f3f6fb;
  --iris-text-muted: #9ba6b6;
  --iris-line: rgba(255, 255, 255, 0.1);

  --iris-idle: #f4f7fb;
  --iris-listen: #56a8ff;
  --iris-act: #38d27d;
  --iris-warn: #ff7a59;

  --iris-glow-blue: rgba(86, 168, 255, 0.28);
  --iris-glow-green: rgba(56, 210, 125, 0.22);
}
```

Color usage rules:

- `idle white` is used as the neutral signature
- `blue` signals listening, presence, intelligence, and focus
- `green` signals execution, success, and momentum
- `orange` is reserved for approval, caution, or power-user actions

## Typography Direction

Use a two-font system:

- Headline font: something expressive and engineered
- UI/body font: something clean and highly legible

Recommended pairing:

- Headlines: `Sora` or `Space Grotesk`
- Body/UI: `Manrope` or `Plus Jakarta Sans`

Typography behavior:

- oversized hero headline
- medium-weight subheads
- compact, crisp UI labels
- avoid long body blocks

## Motion Principles

Motion should imply signal flow, not decoration.

Recommended motion language:

- slow reveal on first load
- subtle line sweeps
- soft pulse on active elements
- section transitions with fade plus upward drift
- border/halo moments inspired by the current overlay state system

No bouncy SaaS motion.

## Messaging Pillars

The homepage copy should keep returning to these four ideas:

1. `Voice to action`
- IRIS does not stop at conversation

2. `Visible reasoning`
- the assistant has states, memory, and execution flow

3. `Real desktop control`
- files, apps, browser, tasks, reminders, email, coding workflows

4. `Safety by design`
- dangerous actions are gated and explicit

## Website Tone

Copy should be:

- concise
- assertive
- product-forward
- low-hype
- proof-oriented

Good:

> From wake word to execution in one flow.

Bad:

> The future of human-AI synergy for everyone everywhere.

## Homepage Narrative

The website should tell this story:

1. IRIS is a real system interface, not just an AI wrapper.
2. It hears, understands, remembers, and executes.
3. It works across desktop actions and workflows.
4. It exposes state and safety visibly.
5. It is built for people who want their computer to respond like an assistant.

## Shared Desktop Reuse

This foundation should carry directly into the desktop app later:

- same color states
- same typography pair
- same thin-line / glass-panel language
- same motion vocabulary
- same contrast between quiet idle and luminous active states

## Creative Direction Options

Top 3 viable website directions:

1. `Quiet sci-fi minimalism` (recommended)
- Why it works: aligns with IRIS’s overlay, voice-state behavior, and technical depth without looking generic.
- Tradeoff: requires careful spacing and typography to avoid feeling sparse.
- Choose when: you want premium, modern, attention-grabbing minimalism.

2. `Clinical lab interface`
- Why it works: emphasizes trust, instrumentation, and system feedback.
- Tradeoff: can feel cold and less memorable emotionally.
- Choose when: you want maximum seriousness and technical credibility.

3. `Neo-utility workstation`
- Why it works: makes IRIS feel like a hacker tool for power users.
- Tradeoff: less broad appeal, more niche.
- Choose when: you want to target builders first and foremost.

Current decision:

- We will design around `Quiet sci-fi minimalism`.

