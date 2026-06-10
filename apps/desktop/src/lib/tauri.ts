import { invoke } from "@tauri-apps/api/core";

import type { DesktopBootstrapSnapshot } from "@iris/types";

function isTauriRuntime() {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export async function readBootstrapSnapshot(): Promise<DesktopBootstrapSnapshot> {
  if (!isTauriRuntime()) {
    return {
      appName: "IRIS Desktop",
      platform: "browser-preview",
      stage: "D1 scaffold",
      backendBridge: "not attached yet",
    };
  }

  return invoke<DesktopBootstrapSnapshot>("get_bootstrap_snapshot");
}
