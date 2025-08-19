#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn greet(name: &str) -> String { format!("Hello, {}! Welcome to Nexus Encryption!", name) }

#[tauri::command]
fn keychain_set(key: String, value: String) -> Result<(), String> {
    keyring::Entry::new("com.nexusencryption.app", &key)
        .map_err(|e| e.to_string())?
        .set_password(&value)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn keychain_get(key: String) -> Result<Option<String>, String> {
    let entry = keyring::Entry::new("com.nexusencryption.app", &key).map_err(|e| e.to_string())?;
    match entry.get_password() {
        Ok(p) => Ok(Some(p)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
fn keychain_delete(key: String) -> Result<(), String> {
    keyring::Entry::new("com.nexusencryption.app", &key)
        .map_err(|e| e.to_string())?
        .delete_password()
        .map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, keychain_set, keychain_get, keychain_delete])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
