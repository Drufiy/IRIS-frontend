# IRIS Desktop Shell

This directory contains the D1 scaffold for the real IRIS desktop application.

Current scope:

- Tauri host project
- React + TypeScript window shell
- shared UI and type packages
- read-only shell snapshot bridge
- Tauri runtime status and local dev backend launch controls

Short term commands:

```powershell
npm run desktop:dev
npm run desktop:tauri
```

Optional local backend overrides:

```powershell
$env:IRIS_BACKEND_DIR="C:\Iris"
$env:IRIS_BACKEND_PYTHON="C:\Iris\.venv\Scripts\python.exe"
$env:IRIS_BACKEND_ENTRY="C:\Iris\main.py"
```
