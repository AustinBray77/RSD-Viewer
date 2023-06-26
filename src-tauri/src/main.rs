// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        //.setup(|app| setup(app))
        .invoke_handler(tauri::generate_handler![get_data, save_data, get_file_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use std::fs;
use std::fs::File;
use std::io::prelude::*;
use std::io::Error;

mod encryptor;
use encryptor::decrypt;
use encryptor::encrypt;

//use json;

/*fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    println!("{}", env!("OUT_DIR"));

    let manifest_path = app
        .path_resolver()
        .resolve_resource("resource/rsd-viewer-manifest.rc")
        .expect("failed to resolve manifest resource");

    //embed_resource::compile(manifest_path, embed_resource::NONE);

    Ok(())
}*/

#[tauri::command]
fn get_data(handle: tauri::AppHandle, password: String) -> Result<String, String> {
    let file = open_file(handle, false);

    let file: File = match file {
        Ok(file) => file,
        Err(error) => return Err(file_error(error)),
    };

    let encrypted_content = read_all_content(file);

    let encrypted_content: String = match encrypted_content {
        Ok(content) => content,
        Err(error) => return Err(error.to_string()),
    };

    return match decrypt(encrypted_content, password) {
        Ok(content) => Ok(content),
        Err(error) => Err(error.to_string()),
    };
}

#[tauri::command]
fn save_data(handle: tauri::AppHandle, data: String, password: String) -> Result<(), String> {
    let content: String = data;

    let encrypted_content = encrypt(content, password);
    let file: Result<File, Error> = open_file(handle, true);

    let file: File = match file {
        Ok(file) => file,
        Err(error) => return Err(file_error(error)),
    };

    match write_all_content(file, encrypted_content.as_str()) {
        Ok(_) => Ok(()),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
fn get_file_path(handle: tauri::AppHandle) -> String {
    let mut path = handle
        .path_resolver()
        .resolve_resource("resources/psd.bin")
        .expect("Failed to resolve file path resource");

    path.pop();

    path.into_os_string().into_string().unwrap()
}

fn file_error(error: Error) -> String {
    "FORCED CLOSURE FILE ERROR ".to_string() + error.to_string().as_str()
}

fn open_file(handle: tauri::AppHandle, truncate: bool) -> Result<File, Error> {
    let path = handle
        .path_resolver()
        .resolve_resource("resources/psd.bin")
        .expect("Failed to resolve file path resource");

    fs::OpenOptions::new()
        .truncate(truncate)
        .write(true)
        .read(true)
        .open(path)
}

fn read_all_content(mut file: File) -> Result<String, Error> {
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    Ok(contents)
}

fn write_all_content(mut file: File, content: &str) -> Result<(), Error> {
    file.write_all(content.as_bytes())
}
