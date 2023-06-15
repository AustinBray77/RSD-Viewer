// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_data, save_data, get_file_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use std::fs;
use std::fs::File;
use std::io::prelude::*;
use std::io::Error;
use std::path::Path;

mod encryptor;
use encryptor::decrypt;
use encryptor::encrypt;

//use json;

#[tauri::command]
fn get_data(password: String) -> Result<String, String> {
    let file = open_file(false);

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
fn save_data(data: String, password: String) -> Result<(), String> {
    let content: String = data;

    let encrypted_content = encrypt(content, password);
    let file: Result<File, Error> = open_file(true);

    let file: File = match file {
        Ok(file) => file,
        Err(error) => return Err(file_error(error)),
    };

    return match write_all_content(file, encrypted_content.as_str()) {
        Ok(_) => Ok(()),
        Err(error) => Err(error.to_string()),
    };
}

#[tauri::command]
fn get_file_path() -> String {
    let mut path: std::path::PathBuf = std::env::current_exe().unwrap();
    path.pop();
    path.push("data");

    return path.into_os_string().into_string().unwrap();
}

fn file_error(error: Error) -> String {
    return "FORCED CLOSURE FILE ERROR".to_string() + error.to_string().as_str();
}

fn open_file(truncate: bool) -> Result<File, Error> {
    let mut path: std::path::PathBuf = std::env::current_exe().unwrap();
    path.pop();
    path.push("data");

    let path_string: String = path.into_os_string().into_string().unwrap();
    let path_str: &str = path_string.as_str();
    let binding = path_str.to_string() + "\\psd.bin";
    let file_str: &str = binding.as_str();

    if !(Path::new(path_str).exists()) {
        fs::create_dir(path_str)?;
    }

    if !(Path::new(file_str).exists()) {
        return fs::OpenOptions::new()
            .create_new(true)
            .write(true)
            .read(true)
            .open(file_str);
    }

    return fs::OpenOptions::new()
        .truncate(truncate)
        .write(true)
        .read(true)
        .open(file_str);
}

fn read_all_content(mut file: File) -> Result<String, Error> {
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    return Ok(contents);
}

fn write_all_content(mut file: File, content: &str) -> Result<(), Error> {
    return file.write_all(content.as_bytes());
}
