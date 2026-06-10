import { invoke } from "@tauri-apps/api/core";

import type { DesktopShellSnapshot } from "@iris/types";

const SHELL_SNAPSHOT_URL = "http://127.0.0.1:7790/shell_snapshot";

export type ShellSnapshotSource = "http" | "tauri" | "preview";

export interface ShellSnapshotResult {
  snapshot: DesktopShellSnapshot;
  source: ShellSnapshotSource;
}

export interface DesktopRuntimeStatus {
  connected: boolean;
  source: string;
  health: "healthy" | "degraded" | "offline";
  healthUrl: string;
  backendDir: string;
  backendDirExists: boolean;
  pythonPath: string;
  pythonExists: boolean;
  entryScript: string;
  entryExists: boolean;
  launchReady: boolean;
  guidance: string;
}

export interface DesktopLaunchResult {
  started: boolean;
  pid: number | null;
  message: string;
  status: DesktopRuntimeStatus;
}

function isTauriRuntime() {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

const browserPreviewSnapshot: DesktopShellSnapshot = {
  bootstrap: {
    appName: "IRIS Desktop",
    platform: "browser-preview",
    stage: "D2 + D3 scaffold",
    backendBridge: "local mock snapshot",
  },
  state: "listening",
  conversation: [
    {
      id: "u1",
      speaker: "user",
      text: "Open Chrome, bring up the frontend repo, and remind me what blocks the desktop app.",
      emphasis: "active",
    },
    {
      id: "i1",
      speaker: "iris",
      text: "Reviewing repo state, checking the current milestone, and preparing the next desktop implementation step.",
    },
  ],
  actions: [
    { id: "a1", label: "Browser focus", detail: "Repo tab pinned and ready", status: "running" },
    { id: "a2", label: "Milestone summary", detail: "Collecting website completion output", status: "complete" },
    { id: "a3", label: "Desktop plan", detail: "Waiting for backend bridge hookup", status: "queued" },
  ],
  providers: [
    { id: "p1", label: "LLM routing", value: "Read-only snapshot connected", health: "degraded" },
    { id: "p2", label: "ASR", value: "Awaiting live backend runtime", health: "degraded" },
    { id: "p3", label: "TTS", value: "Awaiting live backend runtime", health: "degraded" },
  ],
  memory: [
    { id: "m1", title: "Current milestone", detail: "Website is complete and desktop shell work has started." },
    { id: "m2", title: "Platform goal", detail: "One shared IRIS app surface across Windows and macOS." },
  ],
  settings: [
    { id: "s1", label: "Startup mode", value: "Manual launch until backend supervision lands" },
    { id: "s2", label: "Voice trigger", value: "Wake flow planned for later milestone" },
  ],
  approval: {
    title: "Approval surface placeholder",
    summary: "High-risk or state-changing actions will appear here once the execution bridge is live.",
    consequence: "The D2 shell keeps approvals structurally present so they remain part of the product, not a late add-on.",
  },
  diagnostics: [
    { id: "d1", label: "Backend bridge", value: "Read-only snapshot only", health: "degraded" },
    { id: "d2", label: "Memory", value: "Static preview contract", health: "healthy" },
    { id: "d3", label: "Settings", value: "UI shell ready for live configuration later", health: "healthy" },
  ],
};

export async function readShellSnapshot(): Promise<ShellSnapshotResult> {
  try {
    const response = await fetch(SHELL_SNAPSHOT_URL);
    if (response.ok) {
      return {
        snapshot: (await response.json()) as DesktopShellSnapshot,
        source: "http",
      };
    }
  } catch {
    // Fall through to Tauri invoke or browser preview fallback.
  }

  if (!isTauriRuntime()) {
    return {
      snapshot: browserPreviewSnapshot,
      source: "preview",
    };
  }

  return {
    snapshot: await invoke<DesktopShellSnapshot>("get_shell_snapshot"),
    source: "tauri",
  };
}

export async function readRuntimeStatus(): Promise<DesktopRuntimeStatus | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DesktopRuntimeStatus>("get_runtime_status");
}

export async function launchBackend(): Promise<DesktopLaunchResult> {
  return invoke<DesktopLaunchResult>("launch_backend");
}
