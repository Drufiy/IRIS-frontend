import { startTransition, useEffect, useState } from "react";

import type { DesktopShellSnapshot, SidebarItem, SurfaceKey } from "@iris/types";
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

import { type ShellSnapshotSource, readShellSnapshot } from "./lib/tauri";

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

function bridgeLabel(source: ShellSnapshotSource) {
  switch (source) {
    case "http":
      return "Live backend HTTP snapshot";
    case "tauri":
      return "Tauri bridge fallback";
    default:
      return "Browser preview snapshot";
  }
}

function surfaceTitle(activeSurface: SurfaceKey) {
  switch (activeSurface) {
    case "actions":
      return "Execution state stays visible while IRIS works.";
    case "memory":
      return "Relevant context becomes part of the operating surface.";
    case "providers":
      return "Providers expose health before failures become confusing.";
    case "settings":
      return "Controls stay near the runtime instead of buried in files.";
    default:
      return "IRIS is becoming a real desktop workspace.";
  }
}

export default function App() {
  const [snapshot, setSnapshot] = useState<DesktopShellSnapshot>(initialSnapshot);
  const [activeSurface, setActiveSurface] = useState<SurfaceKey>("conversation");
  const [bridgeSource, setBridgeSource] = useState<ShellSnapshotSource>("preview");
  const [lastUpdated, setLastUpdated] = useState<string>("Waiting for first snapshot");
  const [bridgeError, setBridgeError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function loadSnapshot() {
      try {
        const next = await readShellSnapshot();
        if (cancelled) {
          return;
        }

        startTransition(() => {
          setSnapshot(next.snapshot);
          setBridgeSource(next.source);
          setBridgeError("");
          setLastUpdated(
            new Intl.DateTimeFormat(undefined, {
              hour: "numeric",
              minute: "2-digit",
              second: "2-digit",
            }).format(new Date()),
          );
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        startTransition(() => {
          setBridgeError(error instanceof Error ? error.message : "Snapshot request failed");
          setLastUpdated("Retrying automatically");
        });
      }
    }

    void loadSnapshot();
    const interval = window.setInterval(() => {
      void loadSnapshot();
    }, 4000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
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
          <ShellSidebar items={sidebarItems} active={activeSurface} onSelect={setActiveSurface} />

          <main className="desktop-main-shell">
            <section className="desktop-hero">
              <div>
                <span className="desktop-kicker">D4 live shell cadence</span>
                <h1>{surfaceTitle(activeSurface)}</h1>
                <p>
                  The shell now refreshes itself against the backend snapshot contract. When the Python runtime is
                  available, this surface follows real health and state data. When it is not, the app degrades
                  into Tauri fallback or browser preview instead of failing silently.
                </p>
              </div>

              <div className="desktop-hero__signals">
                <SignalBadge state={snapshot.state} label="State" detail={stateDetail(snapshot)} />
                <SignalBadge state="reasoning" label="Bridge" detail={bridgeLabel(bridgeSource)} />
                <SignalBadge state="acting" label="Scope" detail="Windows and macOS shared shell" />
              </div>

              <div className="desktop-hero__meta">
                <div className="desktop-meta-card">
                  <strong>Last sync</strong>
                  <span>{lastUpdated}</span>
                </div>
                <div className="desktop-meta-card">
                  <strong>Snapshot mode</strong>
                  <span>{snapshot.bootstrap.backendBridge}</span>
                </div>
                <div className="desktop-meta-card">
                  <strong>Recovery behavior</strong>
                  <span>{bridgeError || "Polling every 4 seconds with graceful fallback."}</span>
                </div>
              </div>
            </section>

            <div className="desktop-grid desktop-grid--primary">
              <SectionCard
                eyebrow="Conversation"
                title="Active thread"
                focused={activeSurface === "conversation"}
              >
                <ThreadFeed entries={snapshot.conversation} />
              </SectionCard>

              <SectionCard eyebrow="Execution" title="Action queue" focused={activeSurface === "actions"}>
                <ActionQueue entries={snapshot.actions} />
              </SectionCard>
            </div>

            <div className="desktop-grid desktop-grid--secondary">
              <SectionCard eyebrow="Providers" title="Runtime health" focused={activeSurface === "providers"}>
                <ProviderGrid providers={snapshot.providers} />
              </SectionCard>

              <SectionCard eyebrow="Memory" title="Context in scope" focused={activeSurface === "memory"}>
                <MemoryList entries={snapshot.memory} />
              </SectionCard>

              <SectionCard eyebrow="Settings" title="Desktop controls" focused={activeSurface === "settings"}>
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
