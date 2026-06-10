# IRIS Desktop D0 Product Freeze

This document locks the first real desktop application structure before deeper implementation starts.

The objective of `D0` is simple:

- define what the desktop app contains
- define how the major surfaces relate to each other
- define what must be shared between Windows and macOS
- prevent the shell from turning into an unstructured chat window

## Product Goal

IRIS Desktop is a `voice-first operating workspace`.

It is not:

- a floating chat bubble
- a generic assistant clone
- a second product disconnected from the website

It is:

- one command center for conversation, execution, memory, providers, and approvals
- one shared product language across Windows and macOS
- the place where IRIS state becomes visible and actionable

## Core Information Architecture

Primary desktop surfaces:

1. `Conversation`
- running thread
- transcripts
- typed input fallback
- streaming responses
- voice state

2. `Actions`
- active action queue
- recent execution history
- action outcomes
- pending steps

3. `Memory`
- current context injected into the task
- saved memories
- memory source visibility
- prune or disable controls later

4. `Providers`
- LLM status
- ASR status
- TTS status
- local vs remote mode
- credential health indicators

5. `Settings`
- launch behavior
- hotkeys and wake controls
- audio devices
- permissions
- diagnostics

6. `Approvals`
- destructive or sensitive requests
- consequence summary
- confirm / deny controls
- audit trail entry

## Window Model

The app should support three presence modes:

1. `Ambient`
- low-clutter listening and status surface
- tray or menu bar oriented
- lightweight state signal

2. `Focused`
- full desktop shell
- sidebar plus main workspace
- used for active work and inspection

3. `Deliberate`
- modal or elevated approval state
- used when risk, permissions, or user intervention matter

## First Window Layout

The initial full-shell window should contain:

- left rail: major surfaces
- top rail: live state, provider health, connection state
- center column: conversation and current task
- right column: actions, memory, approvals, diagnostics
- footer band: system events and timing

## D1 Surface Order

For the first shell implementation, priority is:

1. `Conversation`
2. `Actions`
3. `Providers`
4. `Approvals`
5. `Memory`
6. `Settings`

This order reflects what makes the app feel real fastest.

## Primary User Flows

### Flow A: Quick Voice Request

1. user activates IRIS
2. state changes to listening
3. transcript appears
4. request enters conversation thread
5. action planning becomes visible
6. result streams back
7. response and outcome are stored in history

### Flow B: Review and Approve

1. IRIS plans a warned or dangerous step
2. approval panel becomes explicit
3. summary explains action and consequence
4. user confirms or denies
5. timeline records the decision

### Flow C: Diagnose Provider Issues

1. app detects backend or provider problem
2. provider panel marks degraded system
3. affected services become obvious
4. user can inspect status without opening raw files

## Shared Cross-Platform Rules

The following must remain shared on Windows and macOS:

- state color system
- typography hierarchy
- sidebar structure
- conversation and action model
- provider and approval concepts
- motion vocabulary
- visual emphasis on legibility over clutter

## Platform Adaptation Rules

The following are allowed to adapt by OS:

### Windows

- tray behavior
- notifications
- shell and automation expectations
- file picker behavior
- startup registration

### macOS

- menu bar patterns
- dock behavior
- window chrome expectations
- permission prompts
- shortcuts using Command-based conventions

## D0 Non-Goals

Not part of this freeze:

- final backend transport contract
- final onboarding wording
- final installer and updater flow
- final plugin/security scopes

## Exit Criteria

`D0` is complete when:

- the shell structure is locked
- the first window model is defined
- the surface list is stable
- Windows/macOS shared rules are explicit
- `D1` can scaffold without product ambiguity
