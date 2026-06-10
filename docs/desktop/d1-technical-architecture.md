# IRIS Desktop D1 Technical Architecture

This document records the chosen technical direction for the first desktop application shell.

## Chosen Stack

Recommended and selected:

- `Tauri 2`
- `React`
- `TypeScript`
- `Vite`

Reason:

- strong Windows and macOS path
- lightweight desktop runtime
- easy reuse of IRIS frontend language
- good fit for a local Python backend process

## Repo Shape

The repo is scaffolded toward this structure:

- `apps/desktop/`
  - real desktop application shell
  - frontend window code
  - Tauri Rust host
- `packages/ui/`
  - reusable desktop shell primitives
- `packages/types/`
  - shared TypeScript contracts for shell state

The website remains at the repo root for now.

## Runtime Model

Short term:

- the Tauri app owns the window
- the React app owns presentation state
- the Python backend remains the system source of truth

Near-term bridge plan:

1. Tauri launches or supervises the local backend process
2. desktop frontend reads health and bootstrap state
3. event stream moves through local HTTP or WebSocket
4. approval, provider, and conversation surfaces subscribe to that state

## D1 Scope

The scaffold must provide:

- app entrypoint
- shell layout
- mock data for major surfaces
- Tauri command bridge placeholder
- workspace packages for UI and types

The scaffold does not yet need:

- live backend launch
- provider mutation
- working memory browser
- real approvals
- packaged installers

## Bridge Contract Direction

Initial desktop state should eventually expose:

- current IRIS state
- active transcript
- current task summary
- action queue
- provider health
- approval requests
- diagnostics and uptime

## Security Direction

The D1 scaffold should stay conservative:

- minimal default Tauri capability
- no broad filesystem or shell permissions yet
- no key storage in the frontend layer

## Verification Goals

The scaffold is considered successful if:

- website still builds
- desktop web shell builds
- Tauri project structure is valid
- the desktop app can be advanced in later milestones without reorganizing the repo again
