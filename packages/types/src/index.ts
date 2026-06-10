export type IrisState = "idle" | "listening" | "reasoning" | "acting" | "approval";
export type HealthState = "healthy" | "degraded" | "offline";

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
  health: HealthState;
}

export interface ApprovalRequest {
  title: string;
  summary: string;
  consequence: string;
}

export interface MemoryEntry {
  id: string;
  title: string;
  detail: string;
}

export interface SettingEntry {
  id: string;
  label: string;
  value: string;
}

export interface DiagnosticEntry {
  id: string;
  label: string;
  value: string;
  health: HealthState;
}

export interface DesktopBootstrapSnapshot {
  appName: string;
  platform: string;
  stage: string;
  backendBridge: string;
}

export interface DesktopShellSnapshot {
  bootstrap: DesktopBootstrapSnapshot;
  state: IrisState;
  conversation: ConversationEntry[];
  actions: ActionEntry[];
  providers: ProviderStatus[];
  memory: MemoryEntry[];
  settings: SettingEntry[];
  approval: ApprovalRequest;
  diagnostics: DiagnosticEntry[];
}
