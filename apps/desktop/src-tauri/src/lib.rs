use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct DesktopBootstrapSnapshot {
    app_name: &'static str,
    platform: String,
    stage: &'static str,
    backend_bridge: &'static str,
}

#[tauri::command]
fn get_bootstrap_snapshot() -> DesktopBootstrapSnapshot {
    DesktopBootstrapSnapshot {
        app_name: "IRIS Desktop",
        platform: std::env::consts::OS.to_string(),
        stage: "D1 scaffold",
        backend_bridge: "placeholder bridge until backend transport lands",
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_bootstrap_snapshot])
        .run(tauri::generate_context!())
        .expect("error while running IRIS desktop shell");
}
