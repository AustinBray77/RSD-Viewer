// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use std::fs::File;
use std::io::prelude::*;
use std::path::Path;

mod Encryptor;
use serde_json::Value;
use Encryptor::decrypt;

#[tauri::command]
fn get_data() -> Value {
    let file = open_file();
    let encrypted_content = read_all_content(file);
    let content = decrypt(encrypted_content, String::new());
    return content_to_json(content.as_str()).into();
}

fn content_to_json(content: &str) -> serde_json::Value {
    return serde_json::from_str(content).unwrap();
}

fn open_file() -> File {
    let mut file: File;
    if Path::new("./psd.bin").exists() {
        file = File::open(Path::new("./psd.bin")).unwrap();
    } else {
        file = File::create("./psd.bin").unwrap();
    }

    return file;
}

fn read_all_content(mut file: File) -> String {
    let mut contents = String::new();
    file.read_to_string(&mut contents);
    return contents;
}
