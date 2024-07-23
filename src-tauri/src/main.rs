// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    let debug_mode = environment::ENV_VARS.DEBUG_MODE;

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_data,
            save_data,
            get_file_path,
            set_save_data,
            copy_save_data,
            send_2fa_code
        ])
        .manage(debug_mode)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use std::fs::{self, OpenOptions};
use std::fs::File;
use std::io::Error;
use std::time::SystemTime;

mod api_handler;
mod io_handler;
mod environment;

extern crate rsd_encrypt;

use api_handler::{query_api_for_code, server_decrypt,server_encrypt};
use io_handler::{file_error,open_file, read_all_content, write_all_content};
use rsd_encrypt::{decrypt, encrypt, hashify, legacy_decrypt};

#[tauri::command]
fn get_data(handle: tauri::AppHandle, password: String) -> Result<String, String> {
    let file = open_file(&handle, OpenOptions::new().read(true));

    let file: File = match file {
        Ok(file) => file,
        Err(error) => return Err(file_error(error)),
    };

    let encrypted_content: String = match read_all_content(file) {
        Ok(content) => content,
        Err(error) => return Err(error.to_string()),
    };

    return match decrypt(encrypted_content, password) {
        Ok(content) => Ok(content),
        Err(error) => Err(format!("Password is likely incorrect: {}", error.to_string())),
    };
}

#[tauri::command]
fn save_data(handle: tauri::AppHandle, data: String, password: String) -> Result<(), String> {
    let content: String = data;

    let encrypted_content = encrypt(content, password);
    let file: Result<File, Error> = open_file(&handle, OpenOptions::new().write(true).truncate(true));

    println!("Encrypted Content: {}", encrypted_content);

    let file: File = match file {
        Ok(file) => file,
        Err(error) => return Err(file_error(error)),
    };

    println!("Writing all...");

    match write_all_content(file, encrypted_content.as_str()) {
        Ok(_) => Ok(()),
        Err(error) => {
            println!("Error: {}", error.to_string());
            Err(error.to_string())
        },
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

#[tauri::command]
fn set_save_data(handle: tauri::AppHandle, path: String, is_legacy: bool, password: String) -> Result<(), String> {
    let new_data_file = fs::OpenOptions::new().read(true).open(path);

    let new_data_file = match new_data_file {
        Ok(file) => file,
        Err(error) => return Err(error.to_string()),
    };

    let content = read_all_content(new_data_file);

    let content = match content {
        Ok(content) => content,
        Err(error) => return Err(error.to_string()),
    };

    let decrypted_content: String;

    if is_legacy {
        decrypted_content = match legacy_decrypt(content.clone(), password.clone()) {
            Ok(content) => content,
            Err(error) => return Err(format!("Passwords likely do not match: {}", error.to_string())),
        };
    } else {
        decrypted_content = match decrypt(content.clone(), password.clone()) {
            Ok(content) => content,
            Err(error) => return Err(format!("Passwords likely do not match: {}", error.to_string())),
        };
    }

    save_data(handle, decrypted_content.clone(), password)
}

#[tauri::command]
fn copy_save_data(handle: tauri::AppHandle, mut path: String) -> Result<String, String> {
    let main_file = open_file(&handle, OpenOptions::new().read(true));

    let main_file = match main_file {
        Ok(file) => file,
        Err(error) => return Err(error.to_string()),
    };

    let content = read_all_content(main_file);

    let content = match content {
        Ok(content) => content,
        Err(error) => return Err(error.to_string()),
    };

    let unique_file_name = SystemTime::now().duration_since(SystemTime::UNIX_EPOCH);

    let unique_file_name = match unique_file_name {
        Ok(duration) => format!("{}{}{}", "\\psd-", duration.as_secs(), ".bin"),
        Err(error) => return Err(error.to_string()),
    };

    path += unique_file_name.as_str();

    let new_data_file = fs::OpenOptions::new()
        .truncate(true)
        .write(true)
        .create_new(true)
        .open(path.clone());

    let new_data_file = match new_data_file {
        Ok(file) => file,
        Err(error) => return Err(error.to_string()),
    };

    let write_result = write_all_content(new_data_file, content.as_str());

    match write_result {
        Ok(_) => Ok(path),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
async fn send_2fa_code(_handle: tauri::AppHandle, debug_mode: tauri::State<'_, bool>, phone_number:String) -> Result<String, String> {
    if *debug_mode {
        return Ok("123456".to_string());
    }
   
    let enc_phone_number = server_encrypt(phone_number);

    let hashified_number = hashify(enc_phone_number);

    let api_result = query_api_for_code(hashified_number).await;

    let enc_code = match api_result {
        Ok(res) => {
            println!("Res Text: {}", res);
            res
        },
        Err(error) => { 
            println!("Enc_code Error?");
            return Err(error.to_string()) 
        },
    };

    match server_decrypt(enc_code) {
        Ok(code) => Ok(code),
        Err(error) => { 
            println!("Decrypt Error?");
            Err(error.to_string()) 
        },
    }
}