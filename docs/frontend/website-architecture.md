# IRIS Website Architecture

This document defines `M1` for IRIS: site map, page structure, content hierarchy, and section-level wireframes for the first marketing website.

The website goal is simple:

- get attention fast
- explain IRIS fast
- make the product feel real
- move the visitor toward trying, following, or contributing

## Website Goals

Primary goals:

1. Make IRIS look real and desirable within 5 seconds
2. Explain what IRIS does in one pass
3. Show that IRIS is more than voice chat
4. Build trust around safety and system control
5. Create a bridge into the desktop app and GitHub

## Recommended Sitemap

Initial website pages:

1. `Home`
2. `Capabilities`
3. `How It Works`
4. `Safety`
5. `Desktop App`
6. `Open Source / GitHub`

Optional later pages:

- Docs
- Changelog
- Blog / updates
- Download

## Navigation

Top nav:

- IRIS
- Capabilities
- How It Works
- Safety
- Desktop
- GitHub
- Primary CTA: `See IRIS in Action`

## Homepage Structure

### 1. Hero

Purpose:

- stop the scroll immediately
- establish IRIS as an AI operating layer

Content:

- eyebrow: `Voice-first AI operating layer`
- headline: `Your computer should respond like an assistant.`
- subhead: `IRIS listens, reasons, remembers, and executes real actions across your desktop.`
- CTAs:
  - `Watch the Flow`
  - `Explore Capabilities`

Visual:

- dark atmospheric background
- a luminous border/signal frame inspired by the overlay
- subtle state labels: `IDLE`, `LISTENING`, `ACTING`
- motion line or pulse that suggests an active operating system layer

### 2. Product Summary Strip

Purpose:

- compress the product into four verbs

Content blocks:

- `Listen`
- `Reason`
- `Act`
- `Remember`

Each block gets one line only.

### 3. Capabilities Grid

Purpose:

- show that IRIS performs real tasks

Suggested capability cards:

- Launch apps and control windows
- Run desktop and shell actions
- Navigate and automate the browser
- Manage reminders and tasks
- Send and read email
- Store memory and context
- Support coding workflows
- Provide spoken responses

Visual:

- minimal card grid
- hover states with line glow and subtle lift

### 4. How IRIS Works

Purpose:

- demystify the system without turning the page into docs

Flow:

1. Wake word or request
2. Speech to text
3. Routing and planning
4. Action execution
5. Spoken/UI response

Visual:

- horizontal process band on desktop
- stacked process cards on mobile

### 5. State + Overlay Section

Purpose:

- connect the current backend reality to a distinctive visual identity

Content:

- IRIS exposes state in real time
- listening, acting, approval, and response are visible

Visual:

- border animation showcase
- state color swatches:
  - white for idle
  - blue for listening
  - green for action
  - orange for approvals or warnings

### 6. Safety Section

Purpose:

- reduce fear around system control

Content:

- dangerous actions require explicit approval
- actions are classified by safety level
- memory is stored locally
- cloud providers are explicit and configurable

Visual:

- minimal checklist or command center panel

### 7. Desktop Preview

Purpose:

- create continuity with the next milestone

Content:

- “IRIS is becoming a full desktop experience”
- tease future screens:
  - conversation panel
  - memory and history
  - provider settings
  - live system state

Visual:

- one strong app mock or UI frame
- not too detailed yet

### 8. Open Source / Credibility

Purpose:

- convert interested technical users

Content:

- open-source
- modular Python + Tauri architecture
- voice, memory, browser, and action routing already working

CTAs:

- `View on GitHub`
- `Follow Development`

### 9. Final CTA

Purpose:

- end with momentum

Suggested close:

> IRIS turns voice into real control.

CTAs:

- `Open GitHub`
- `See Desktop Roadmap`

## Page-by-Page Notes

### Capabilities Page

Purpose:

- expand feature understanding beyond the homepage

Sections:

- voice and speech
- desktop control
- browser automation
- memory and context
- productivity actions
- coding and agent workflows

### How It Works Page

Purpose:

- explain architecture visually

Sections:

- input pipeline
- reasoning pipeline
- execution pipeline
- output and overlay

### Safety Page

Purpose:

- explain approvals, classifications, and boundaries

Sections:

- safety levels
- approval gates
- local memory
- cloud provider transparency

### Desktop App Page

Purpose:

- bridge the website into the next milestone

Sections:

- why desktop matters
- always-available assistant layer
- live state + settings + memory + actions
- “coming next”

## Homepage Wireframe

```text
[ NAV ]

[ HERO ]
Voice-first AI operating layer
Your computer should respond like an assistant.
[ Watch the Flow ] [ Explore Capabilities ]

[ SUMMARY STRIP ]
Listen | Reason | Act | Remember

[ CAPABILITIES GRID ]
8 cards

[ HOW IT WORKS ]
Wake -> Understand -> Plan -> Execute -> Respond

[ STATE + OVERLAY ]
Animated border / state demo

[ SAFETY ]
Approval gates / classified actions / local memory

[ DESKTOP PREVIEW ]
Desktop UI teaser

[ OPEN SOURCE ]
GitHub + architecture credibility

[ FINAL CTA ]
IRIS turns voice into real control.
```

## Content Priorities

The site should emphasize these ideas in order:

1. `Real action`
2. `Minimal but powerful interface`
3. `Voice-first interaction`
4. `Safety and visibility`
5. `Open-source technical credibility`

## Design Constraints for Build

When we move into implementation:

- dark-first visual system
- mobile responsive from the start
- one strong accent family, not rainbow gradients
- big hero typography
- clear spacing rhythm
- reusable tokens for desktop later

## Open Questions for Later

These do not block M0 + M1, but they will matter before coding:

1. Should the primary CTA go to GitHub, docs, or a waitlist/download page?
2. Do you want video/demo assets embedded or should we design around static visual storytelling first?
3. Should the website be purely marketing, or should it also host docs and changelog in v1?

