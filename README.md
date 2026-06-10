# IRIS Frontend

Frontend home for IRIS across both the launch website and the future desktop application shell.

## Scope

This repo currently contains:

- the public IRIS website
- the frontend design foundation docs
- the D0 desktop product freeze docs
- the D1 desktop shell scaffold for the upcoming Tauri app

The implementation is aligned to the current backend repo at:

- `https://github.com/Drufiy/IRIS-backend`

## Stack

Website:

- Vite
- HTML
- CSS
- vanilla JavaScript

Desktop scaffold:

- Tauri 2
- React
- TypeScript
- Vite

## Local Development

```powershell
npm install
npm run dev
```

Desktop web shell:

```powershell
npm run desktop:dev
```

Desktop Tauri shell:

```powershell
npm run desktop:tauri
```

## Build

```powershell
npm run build
```

## Structure

- `index.html` - marketing site shell
- `src/main.js` - website state animation and reveal logic
- `src/styles.css` - shared website visual system
- `docs/frontend/` - website foundation docs
- `docs/desktop/` - desktop product freeze and technical architecture docs
- `apps/desktop/` - Tauri + React + TypeScript desktop shell scaffold
- `packages/ui/` - shared desktop UI primitives
- `packages/types/` - shared desktop shell types
