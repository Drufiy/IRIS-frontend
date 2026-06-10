import { startTransition, useEffect, useState } from "react";

import type {
  ActionEntry,
  ApprovalRequest,
  ConversationEntry,
  DesktopBootstrapSnapshot,
  ProviderStatus,
  SidebarItem,
} from "@iris/types";
import { SectionCard, ShellSidebar, SignalBadge, WindowChrome } from "@iris/ui";

import { readBootstrapSnapshot } from "./lib/tauri";

const sidebarItems: SidebarItem[] = [
  { key: "conversation", label: "Conversation", hint: "Voice and transcript flow" },
  { key: "actions", label: "Actions", hint: "Execution queue and history" },
  { key: "memory", label: "Memory", hint: "Task context and recall" },
  { key: "providers", label: "Providers", hint: "LLM, ASR, TTS health" },
  { key: "settings", label: "Settings", hint: "Permissions and preferences" },
];

const conversation: ConversationEntry[] = [
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
];

const actions: ActionEntry[] = [
  { id: "a1", label: "Browser focus", detail: "Repo tab pinned and ready", status: "running" },
  { id: "a2", label: "Milestone summary", detail: "Collecting website completion output", status: "complete" },
  { id: "a3", label: "Desktop plan", detail: "Waiting for backend bridge hookup", status: "queued" },
];

const providers: ProviderStatus[] = [
  { id: "p1", label: "LLM routing", value: "Awaiting backend bridge", health: "degraded" },
  { id: "p2", label: "ASR", value: "Expected from backend runtime", health: "degraded" },
  { id: "p3", label: "TTS", value: "Expected from backend runtime", health: "degraded" },
];

const approval: ApprovalRequest = {
  title: "Approval surface placeholder",
  summary: "High-risk or state-changing actions will appear here once the execution bridge is live.",
  consequence: "The D1 shell keeps this visible so approvals never become an afterthought in the product.",
};

export default function App() {
  const [snapshot, setSnapshot] = useState<DesktopBootstrapSnapshot>({
    appName: "IRIS Desktop",
    platform: "loading",
    stage: "Booting shell",
    backendBridge: "checking runtime",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadSnapshot() {
      const next = await readBootstrapSnapshot();
      if (cancelled) {
        return;
      }

      startTransition(() => {
        setSnapshot(next);
      });
    }

    void loadSnapshot();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="desktop-app">
      <WindowChrome
        title={snapshot.appName}
        subtitle={`Platform: ${snapshot.platform}`}
        status={<SignalBadge state="listening" label={snapshot.stage} detail={snapshot.backendBridge} />}
      >
        <div className="desktop-layout">
          <ShellSidebar items={sidebarItems} active="conversation" />

          <main className="desktop-main-shell">
            <section className="desktop-hero">
              <div>
                <span className="desktop-kicker">D1 shell scaffold</span>
                <h1>IRIS is becoming a real desktop workspace.</h1>
                <p>
                  This shell locks the app structure before the live backend bridge lands: conversation, actions,
                  providers, memory, settings, and approvals all belong in one operating surface.
                </p>
              </div>

              <div className="desktop-hero__signals">
                <SignalBadge state="listening" label="State" detail="Listening and transcript-ready" />
                <SignalBadge state="reasoning" label="Bridge" detail={snapshot.backendBridge} />
                <SignalBadge state="acting" label="Scope" detail="Windows and macOS shared shell" />
              </div>
            </section>

            <div className="desktop-grid">
              <SectionCard eyebrow="Conversation" title="Active thread">
                <div className="thread-list">
                  {conversation.map((entry) => (
                    <article
                      key={entry.id}
                      className={`thread-entry${entry.emphasis === "active" ? " is-active" : ""}`}
                    >
                      <strong>{entry.speaker === "user" ? "You" : "IRIS"}</strong>
                      <p>{entry.text}</p>
                    </article>
                  ))}
                </div>
              </SectionCard>

              <SectionCard eyebrow="Execution" title="Action queue">
                <div className="action-list">
                  {actions.map((entry) => (
                    <div key={entry.id} className={`action-row action-row--${entry.status}`}>
                      <strong>{entry.label}</strong>
                      <span>{entry.detail}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard eyebrow="Providers" title="Runtime health">
                <div className="provider-list">
                  {providers.map((provider) => (
                    <div key={provider.id} className={`provider-row provider-row--${provider.health}`}>
                      <strong>{provider.label}</strong>
                      <span>{provider.value}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard eyebrow="Approval" title={approval.title}>
                <div className="approval-block">
                  <p>{approval.summary}</p>
                  <div className="approval-note">{approval.consequence}</div>
                  <div className="approval-actions">
                    <button type="button">Confirm</button>
                    <button type="button" className="is-secondary">
                      Deny
                    </button>
                  </div>
                </div>
              </SectionCard>
            </div>

            <footer className="desktop-footer-band">
              <div>
                <strong>Memory</strong>
                <span>Context panel arrives in the next implementation phase.</span>
              </div>
              <div>
                <strong>Settings</strong>
                <span>Permissions, startup, audio devices, and diagnostics will live here next.</span>
              </div>
            </footer>
          </main>
        </div>
      </WindowChrome>
    </div>
  );
}
