import { startTransition, useEffect, useState } from "react";

import type { DesktopShellSnapshot, SidebarItem } from "@iris/types";
import {
  ActionQueue,
  ApprovalPanel,
  DiagnosticsStrip,
  MemoryList,
  ProviderGrid,
  SectionCard,
  SettingsList,
  ShellSidebar,
  SignalBadge,
  ThreadFeed,
  WindowChrome,
} from "@iris/ui";

import { readShellSnapshot } from "./lib/tauri";

const sidebarItems: SidebarItem[] = [
  { key: "conversation", label: "Conversation", hint: "Voice and transcript flow" },
  { key: "actions", label: "Actions", hint: "Execution queue and history" },
  { key: "memory", label: "Memory", hint: "Task context and recall" },
  { key: "providers", label: "Providers", hint: "LLM, ASR, TTS health" },
  { key: "settings", label: "Settings", hint: "Permissions and preferences" },
];

const initialSnapshot: DesktopShellSnapshot = {
  bootstrap: {
    appName: "IRIS Desktop",
    platform: "loading",
    stage: "Booting shell",
    backendBridge: "checking runtime",
  },
  state: "listening",
  conversation: [],
  actions: [],
  providers: [],
  memory: [],
  settings: [],
  approval: {
    title: "Loading approval state",
    summary: "Preparing desktop shell snapshot.",
    consequence: "The read-only bridge is initializing.",
  },
  diagnostics: [],
};

function stateDetail(snapshot: DesktopShellSnapshot) {
  switch (snapshot.state) {
    case "listening":
      return "Listening and transcript-ready";
    case "reasoning":
      return "Planning against current context";
    case "acting":
      return "Executing visible desktop flow";
    case "approval":
      return "Waiting for human confirmation";
    default:
      return "Standing by for the next request";
  }
}

export default function App() {
  const [snapshot, setSnapshot] = useState<DesktopShellSnapshot>(initialSnapshot);

  useEffect(() => {
    let cancelled = false;

    async function loadSnapshot() {
      const next = await readShellSnapshot();
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
        title={snapshot.bootstrap.appName}
        subtitle={`Platform: ${snapshot.bootstrap.platform}`}
        status={
          <SignalBadge
            state={snapshot.state}
            label={snapshot.bootstrap.stage}
            detail={snapshot.bootstrap.backendBridge}
          />
        }
      >
        <div className="desktop-layout">
          <ShellSidebar items={sidebarItems} active="conversation" />

          <main className="desktop-main-shell">
            <section className="desktop-hero">
              <div>
                <span className="desktop-kicker">D2 system + D3 bridge</span>
                <h1>IRIS is becoming a real desktop workspace.</h1>
                <p>
                  The shell now expects a read-only runtime snapshot instead of hardcoded page-level mocks. That
                  means conversation, actions, providers, memory, settings, approvals, and diagnostics can all
                  grow against one shared desktop contract.
                </p>
              </div>

              <div className="desktop-hero__signals">
                <SignalBadge state={snapshot.state} label="State" detail={stateDetail(snapshot)} />
                <SignalBadge state="reasoning" label="Bridge" detail={snapshot.bootstrap.backendBridge} />
                <SignalBadge state="acting" label="Scope" detail="Windows and macOS shared shell" />
              </div>
            </section>

            <div className="desktop-grid desktop-grid--primary">
              <SectionCard eyebrow="Conversation" title="Active thread">
                <ThreadFeed entries={snapshot.conversation} />
              </SectionCard>

              <SectionCard eyebrow="Execution" title="Action queue">
                <ActionQueue entries={snapshot.actions} />
              </SectionCard>
            </div>

            <div className="desktop-grid desktop-grid--secondary">
              <SectionCard eyebrow="Providers" title="Runtime health">
                <ProviderGrid providers={snapshot.providers} />
              </SectionCard>

              <SectionCard eyebrow="Memory" title="Context in scope">
                <MemoryList entries={snapshot.memory} />
              </SectionCard>

              <SectionCard eyebrow="Settings" title="Desktop controls">
                <SettingsList entries={snapshot.settings} />
              </SectionCard>

              <SectionCard eyebrow="Approval" title={snapshot.approval.title}>
                <ApprovalPanel request={snapshot.approval} />
              </SectionCard>
            </div>

            <DiagnosticsStrip entries={snapshot.diagnostics} />
          </main>
        </div>
      </WindowChrome>
    </div>
  );
}
