use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct DesktopBootstrapSnapshot {
    app_name: &'static str,
    platform: String,
    stage: &'static str,
    backend_bridge: &'static str,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct ConversationEntry {
    id: &'static str,
    speaker: &'static str,
    text: &'static str,
    emphasis: Option<&'static str>,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct ActionEntry {
    id: &'static str,
    label: &'static str,
    detail: &'static str,
    status: &'static str,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct ProviderStatus {
    id: &'static str,
    label: &'static str,
    value: &'static str,
    health: &'static str,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct MemoryEntry {
    id: &'static str,
    title: &'static str,
    detail: &'static str,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct SettingEntry {
    id: &'static str,
    label: &'static str,
    value: &'static str,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct DiagnosticEntry {
    id: &'static str,
    label: &'static str,
    value: &'static str,
    health: &'static str,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct ApprovalRequest {
    title: &'static str,
    summary: &'static str,
    consequence: &'static str,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct DesktopShellSnapshot {
    bootstrap: DesktopBootstrapSnapshot,
    state: &'static str,
    conversation: Vec<ConversationEntry>,
    actions: Vec<ActionEntry>,
    providers: Vec<ProviderStatus>,
    memory: Vec<MemoryEntry>,
    settings: Vec<SettingEntry>,
    approval: ApprovalRequest,
    diagnostics: Vec<DiagnosticEntry>,
}

#[tauri::command]
fn get_shell_snapshot() -> DesktopShellSnapshot {
    DesktopShellSnapshot {
        bootstrap: DesktopBootstrapSnapshot {
            app_name: "IRIS Desktop",
            platform: std::env::consts::OS.to_string(),
            stage: "D2 + D3 scaffold",
            backend_bridge: "read-only shell snapshot placeholder",
        },
        state: "listening",
        conversation: vec![
            ConversationEntry {
                id: "u1",
                speaker: "user",
                text: "Open Chrome, bring up the frontend repo, and remind me what blocks the desktop app.",
                emphasis: Some("active"),
            },
            ConversationEntry {
                id: "i1",
                speaker: "iris",
                text: "Reviewing repo state, checking the current milestone, and preparing the next desktop implementation step.",
                emphasis: None,
            },
        ],
        actions: vec![
            ActionEntry {
                id: "a1",
                label: "Browser focus",
                detail: "Repo tab pinned and ready",
                status: "running",
            },
            ActionEntry {
                id: "a2",
                label: "Milestone summary",
                detail: "Collecting desktop scaffold state",
                status: "complete",
            },
            ActionEntry {
                id: "a3",
                label: "Backend bridge",
                detail: "Read-only contract in place, live transport still pending",
                status: "queued",
            },
        ],
        providers: vec![
            ProviderStatus {
                id: "p1",
                label: "LLM routing",
                value: "Awaiting live backend health endpoint",
                health: "degraded",
            },
            ProviderStatus {
                id: "p2",
                label: "ASR",
                value: "Shell ready for Groq status wiring",
                health: "degraded",
            },
            ProviderStatus {
                id: "p3",
                label: "TTS",
                value: "Shell ready for ElevenLabs status wiring",
                health: "degraded",
            },
        ],
        memory: vec![
            MemoryEntry {
                id: "m1",
                title: "Current milestone",
                detail: "Website is complete and the real desktop shell scaffold is live.",
            },
            MemoryEntry {
                id: "m2",
                title: "Product rule",
                detail: "One shared app structure across Windows and macOS, not two disconnected products.",
            },
        ],
        settings: vec![
            SettingEntry {
                id: "s1",
                label: "Launch mode",
                value: "Manual until backend supervision is attached",
            },
            SettingEntry {
                id: "s2",
                label: "Permissions",
                value: "Conservative default Tauri capability only",
            },
        ],
        approval: ApprovalRequest {
            title: "Approval surface placeholder",
            summary: "High-risk or state-changing actions will appear here once the execution bridge is live.",
            consequence: "The shell already reserves approval space so safety remains part of the product structure from the start.",
        },
        diagnostics: vec![
            DiagnosticEntry {
                id: "d1",
                label: "Backend bridge",
                value: "Read-only shell snapshot is available",
                health: "healthy",
            },
            DiagnosticEntry {
                id: "d2",
                label: "Providers",
                value: "UI contract ready, live health still pending",
                health: "degraded",
            },
            DiagnosticEntry {
                id: "d3",
                label: "Cross-platform scope",
                value: "Shared shell validated for Windows and macOS direction",
                health: "healthy",
            },
        ],
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_shell_snapshot])
        .run(tauri::generate_context!())
        .expect("error while running IRIS desktop shell");
}
