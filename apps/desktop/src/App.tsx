import { startTransition, useEffect, useRef, useState } from "react";

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

import {
  launchBackend,
  readRuntimeStatus,
  readShellSnapshot,
  type DesktopRuntimeStatus,
  type ShellSnapshotSource,
} from "./lib/tauri";

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

function runtimeHealthLabel(runtimeStatus: DesktopRuntimeStatus | null) {
  if (!runtimeStatus) {
    return "Desktop runtime check unavailable";
  }

  if (runtimeStatus.connected) {
    return "Backend reachable and snapshot-ready";
  }

  if (runtimeStatus.launchReady) {
    return "Launch path is ready, backend is just offline";
  }

  return "Backend path is incomplete";
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
  const attemptedAutoStart = useRef(false);
  const [snapshot, setSnapshot] = useState<DesktopShellSnapshot>(initialSnapshot);
  const [activeSurface, setActiveSurface] = useState<SurfaceKey>("conversation");
  const [bridgeSource, setBridgeSource] = useState<ShellSnapshotSource>("preview");
  const [lastUpdated, setLastUpdated] = useState<string>("Waiting for first snapshot");
  const [bridgeError, setBridgeError] = useState<string>("");
  const [runtimeStatus, setRuntimeStatus] = useState<DesktopRuntimeStatus | null>(null);
  const [launchingBackend, setLaunchingBackend] = useState(false);
  const [launchFeedback, setLaunchFeedback] = useState("Awaiting desktop runtime check");

  useEffect(() => {
    let cancelled = false;

    async function startIris(next: DesktopRuntimeStatus, trigger: "auto" | "manual") {
      if (cancelled) {
        return;
      }

      if (next.connected) {
        startTransition(() => {
          setRuntimeStatus(next);
          setLaunchFeedback("IRIS is already running.");
        });
        return;
      }

      if (!next.launchReady) {
        startTransition(() => {
          setRuntimeStatus(next);
          setLaunchFeedback(next.guidance);
        });
        return;
      }

      setLaunchingBackend(true);
      try {
        const result = await launchBackend();
        if (cancelled) {
          return;
        }

        startTransition(() => {
          setRuntimeStatus(result.status);
          setLaunchFeedback(
            trigger === "auto"
              ? `IRIS start attempted automatically. ${result.message}`
              : result.message,
          );
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        startTransition(() => {
          setLaunchFeedback(error instanceof Error ? error.message : "IRIS start failed");
        });
      } finally {
        if (!cancelled) {
          setLaunchingBackend(false);
        }
      }
    }

    async function refreshRuntimeStatus() {
      try {
        const next = await readRuntimeStatus();
        if (cancelled || next === null) {
          return;
        }

        startTransition(() => {
          setRuntimeStatus(next);
          setLaunchFeedback(next.guidance);
        });

        if (!attemptedAutoStart.current && !next.connected && next.launchReady) {
          attemptedAutoStart.current = true;
          void startIris(next, "auto");
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        startTransition(() => {
          setLaunchFeedback(error instanceof Error ? error.message : "Runtime status unavailable");
        });
      }
    }

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
    void refreshRuntimeStatus();
    const interval = window.setInterval(() => {
      void loadSnapshot();
      void refreshRuntimeStatus();
    }, 4000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  async function handleBackendLaunch() {
    if (!runtimeStatus) {
      return;
    }

    attemptedAutoStart.current = true;
    setLaunchingBackend(true);
    try {
      const result = await launchBackend();
      startTransition(() => {
        setRuntimeStatus(result.status);
        setLaunchFeedback(result.message);
      });
    } catch (error) {
      startTransition(() => {
        setLaunchFeedback(error instanceof Error ? error.message : "IRIS start failed");
      });
    } finally {
      setLaunchingBackend(false);
    }
  }

  async function handleRuntimeRefresh() {
    try {
      const next = await readRuntimeStatus();
      if (!next) {
        return;
      }

      startTransition(() => {
        setRuntimeStatus(next);
        setLaunchFeedback(next.guidance);
      });
    } catch (error) {
      startTransition(() => {
        setLaunchFeedback(error instanceof Error ? error.message : "Runtime refresh failed");
      });
    }
  }

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
                  Open the native desktop app and IRIS should start itself when the backend path is ready. When the
                  Python runtime is available, this surface follows real health and state data. When it is not, the
                  app stays explicit about what is blocked instead of failing silently.
                </p>
              </div>

              <div className="desktop-hero__signals">
                <SignalBadge state={snapshot.state} label="State" detail={stateDetail(snapshot)} />
                <SignalBadge state="reasoning" label="Bridge" detail={bridgeLabel(bridgeSource)} />
                <SignalBadge
                  state={runtimeStatus?.connected ? "acting" : "approval"}
                  label="Runtime"
                  detail={runtimeHealthLabel(runtimeStatus)}
                />
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

              {runtimeStatus ? (
                <div className="desktop-runtime-panel">
                  <div className="desktop-runtime-panel__copy">
                    <strong>Start IRIS</strong>
                    <span>{launchFeedback}</span>
                  </div>
                  <div className="desktop-runtime-panel__actions">
                    <div className="desktop-runtime-panel__buttons">
                      <button
                        type="button"
                        className="desktop-cta-button"
                        onClick={() => void handleBackendLaunch()}
                        disabled={launchingBackend || runtimeStatus.connected || !runtimeStatus.launchReady}
                      >
                        {runtimeStatus.connected
                          ? "IRIS running"
                          : launchingBackend
                            ? "Starting IRIS..."
                            : "Start IRIS"}
                      </button>
                      <button
                        type="button"
                        className="desktop-secondary-button"
                        onClick={() => void handleRuntimeRefresh()}
                      >
                        Refresh status
                      </button>
                    </div>
                    <div className="desktop-runtime-panel__chips">
                      <span className={`desktop-chip desktop-chip--${runtimeStatus.health}`}>
                        {runtimeStatus.health}
                      </span>
                      <span className={`desktop-chip desktop-chip--${runtimeStatus.launchReady ? "healthy" : "offline"}`}>
                        {runtimeStatus.launchReady ? "launch-ready" : "launch-blocked"}
                      </span>
                    </div>
                    <div className="desktop-runtime-panel__paths">
                      <span>{runtimeStatus.healthUrl}</span>
                      <span>{runtimeStatus.pythonPath}</span>
                    </div>
                  </div>
                </div>
              ) : null}
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
                {runtimeStatus ? (
                  <div className="desktop-inline-note">
                    <strong>Backend root present</strong>
                    <span>{runtimeStatus.backendDirExists ? "Yes" : "No"}</span>
                    <strong>Backend directory</strong>
                    <span>{runtimeStatus.backendDir}</span>
                    <strong>Python present</strong>
                    <span>{runtimeStatus.pythonExists ? "Yes" : "No"}</span>
                    <strong>Entry script</strong>
                    <span>{runtimeStatus.entryScript}</span>
                    <strong>Entry present</strong>
                    <span>{runtimeStatus.entryExists ? "Yes" : "No"}</span>
                  </div>
                ) : null}
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
