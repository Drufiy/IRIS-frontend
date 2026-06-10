export type IrisState = "idle" | "listening" | "reasoning" | "acting" | "approval";

export type SurfaceKey =
  | "conversation"
  | "actions"
  | "memory"
  | "providers"
  | "settings";

export interface SidebarItem {
  key: SurfaceKey;
  label: string;
  hint: string;
}

export interface ConversationEntry {
  id: string;
  speaker: "user" | "iris";
  text: string;
  emphasis?: "default" | "active";
}

export interface ActionEntry {
  id: string;
  label: string;
  detail: string;
  status: "queued" | "running" | "complete" | "approval";
}

export interface ProviderStatus {
  id: string;
  label: string;
  value: string;
  health: "healthy" | "degraded" | "offline";
}

export interface ApprovalRequest {
  title: string;
  summary: string;
  consequence: string;
}

export interface DesktopBootstrapSnapshot {
  appName: string;
  platform: string;
  stage: string;
  backendBridge: string;
}
