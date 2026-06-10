use reqwest::blocking::Client;
use serde::Serialize;
use std::path::PathBuf;
use std::process::Command;
use std::time::Duration;

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

const BACKEND_HEALTH_URL: &str = "http://127.0.0.1:7790/health";

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

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct RuntimeStatus {
    connected: bool,
    source: &'static str,
    health_url: String,
    backend_dir: String,
    python_path: String,
    entry_script: String,
    guidance: String,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct LaunchResult {
    started: bool,
    message: String,
    status: RuntimeStatus,
}

fn default_backend_dir() -> PathBuf {
    if let Ok(value) = std::env::var("IRIS_BACKEND_DIR") {
        return PathBuf::from(value);
    }

    if cfg!(target_os = "windows") {
        PathBuf::from(r"C:\Iris")
    } else {
        let home = std::env::var("HOME").unwrap_or_else(|_| String::from("."));
        PathBuf::from(home).join("Iris")
    }
}

fn default_python_path(backend_dir: &PathBuf) -> PathBuf {
    if let Ok(value) = std::env::var("IRIS_BACKEND_PYTHON") {
        return PathBuf::from(value);
    }

    if cfg!(target_os = "windows") {
        backend_dir.join(".venv").join("Scripts").join("python.exe")
    } else {
        backend_dir.join(".venv").join("bin").join("python")
    }
}

fn default_entry_script(backend_dir: &PathBuf) -> PathBuf {
    if let Ok(value) = std::env::var("IRIS_BACKEND_ENTRY") {
        return PathBuf::from(value);
    }

    backend_dir.join("main.py")
}

fn current_runtime_status() -> RuntimeStatus {
    let backend_dir = default_backend_dir();
    let python_path = default_python_path(&backend_dir);
    let entry_script = default_entry_script(&backend_dir);

    let connected = Client::builder()
        .timeout(Duration::from_millis(1200))
        .build()
        .and_then(|client| client.get(BACKEND_HEALTH_URL).send())
        .map(|response| response.status().is_success())
        .unwrap_or(false);

    let guidance = if connected {
        String::from("Backend health endpoint responded. The desktop shell can read live runtime state.")
    } else if !python_path.exists() {
        format!(
            "Backend is offline and no Python executable was found at {}. Set IRIS_BACKEND_PYTHON or create the backend virtual environment.",
            python_path.display()
        )
    } else if !entry_script.exists() {
        format!(
            "Backend is offline and no entry script was found at {}. Set IRIS_BACKEND_ENTRY or point IRIS_BACKEND_DIR to the backend repo.",
            entry_script.display()
        )
    } else {
        format!(
            "Backend is offline. The desktop app can try launching {} from {}.",
            entry_script.display(),
            backend_dir.display()
        )
    };

    RuntimeStatus {
        connected,
        source: if connected { "http" } else { "local-dev" },
        health_url: String::from(BACKEND_HEALTH_URL),
        backend_dir: backend_dir.display().to_string(),
        python_path: python_path.display().to_string(),
        entry_script: entry_script.display().to_string(),
        guidance,
    }
}

#[tauri::command]
fn get_runtime_status() -> RuntimeStatus {
    current_runtime_status()
}

#[tauri::command]
fn launch_backend() -> Result<LaunchResult, String> {
    let status = current_runtime_status();
    if status.connected {
        return Ok(LaunchResult {
            started: false,
            message: String::from("Backend is already reachable."),
            status,
        });
    }

    let backend_dir = PathBuf::from(&status.backend_dir);
    let python_path = PathBuf::from(&status.python_path);
    let entry_script = PathBuf::from(&status.entry_script);

    if !python_path.exists() {
        return Err(format!(
            "Python executable not found at {}",
            python_path.display()
        ));
    }

    if !entry_script.exists() {
        return Err(format!(
            "Backend entry script not found at {}",
            entry_script.display()
        ));
    }

    let mut command = Command::new(&python_path);
    command.arg(&entry_script).current_dir(&backend_dir);

    #[cfg(target_os = "windows")]
    {
        command.creation_flags(0x08000000);
    }

    command
        .spawn()
        .map_err(|error| format!("Failed to launch backend: {error}"))?;

    let refreshed = current_runtime_status();
    Ok(LaunchResult {
        started: true,
        message: if refreshed.connected {
            String::from("Backend launch triggered and health endpoint responded.")
        } else {
            String::from("Backend launch triggered. Health endpoint has not responded yet.")
        },
        status: refreshed,
    })
}

#[tauri::command]
fn get_shell_snapshot() -> DesktopShellSnapshot {
    DesktopShellSnapshot {
        bootstrap: DesktopBootstrapSnapshot {
            app_name: "IRIS Desktop",
            platform: std::env::consts::OS.to_string(),
            stage: "D5 runtime supervision",
            backend_bridge: "Tauri host can inspect and launch local backend",
        },
        state: "listening",
        conversation: vec![
            ConversationEntry {
                id: "u1",
                speaker: "user",
                text: "Launch the backend if needed and keep the shell tied to real runtime health.",
                emphasis: Some("active"),
            },
            ConversationEntry {
                id: "i1",
                speaker: "iris",
                text: "Watching the local health endpoint, using fallback snapshots when needed, and preparing supervision controls.",
                emphasis: None,
            },
        ],
        actions: vec![
            ActionEntry {
                id: "a1",
                label: "Runtime health",
                detail: "Polling local backend status",
                status: "running",
            },
            ActionEntry {
                id: "a2",
                label: "Bridge fallback",
                detail: "Using HTTP first, then Tauri snapshot fallback",
                status: "complete",
            },
            ActionEntry {
                id: "a3",
                label: "Backend supervision",
                detail: "Local dev launch path prepared in desktop host",
                status: "queued",
            },
        ],
        providers: vec![
            ProviderStatus {
                id: "p1",
                label: "LLM routing",
                value: "Ready for live health wiring through Python runtime",
                health: "degraded",
            },
            ProviderStatus {
                id: "p2",
                label: "ASR",
                value: "Groq status expected from backend snapshot",
                health: "degraded",
            },
            ProviderStatus {
                id: "p3",
                label: "TTS",
                value: "ElevenLabs status expected from backend snapshot",
                health: "degraded",
            },
        ],
        memory: vec![
            MemoryEntry {
                id: "m1",
                title: "Current milestone",
                detail: "Desktop host now knows how to inspect backend reachability and attempt local launch.",
            },
            MemoryEntry {
                id: "m2",
                title: "Cross-platform rule",
                detail: "Windows and macOS share one shell while launch paths adapt by platform.",
            },
        ],
        settings: vec![
            SettingEntry {
                id: "s1",
                label: "Launch mode",
                value: "Tauri local supervision for dev runtime",
            },
            SettingEntry {
                id: "s2",
                label: "Backend override",
                value: "IRIS_BACKEND_DIR / IRIS_BACKEND_PYTHON / IRIS_BACKEND_ENTRY",
            },
        ],
        approval: ApprovalRequest {
            title: "Approval surface placeholder",
            summary: "High-risk or state-changing actions will appear here once the execution bridge is live.",
            consequence: "The shell keeps approvals visible early so safety does not become an afterthought.",
        },
        diagnostics: vec![
            DiagnosticEntry {
                id: "d1",
                label: "Runtime host",
                value: "Tauri host can probe backend health",
                health: "healthy",
            },
            DiagnosticEntry {
                id: "d2",
                label: "Launch path",
                value: "Desktop host can attempt local backend launch",
                health: "healthy",
            },
            DiagnosticEntry {
                id: "d3",
                label: "Cross-platform scope",
                value: "Shared shell stays aligned for Windows and macOS",
                health: "healthy",
            },
        ],
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_runtime_status,
            launch_backend,
            get_shell_snapshot
        ])
        .run(tauri::generate_context!())
        .expect("error while running IRIS desktop shell");
}
