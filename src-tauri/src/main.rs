// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_data,
            save_data,
            get_file_path,
            set_save_data,
            copy_save_data,
            send_code_setup
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use std::fs;
use std::fs::File;
use std::io::prelude::*;
use std::io::Error;
use std::time::SystemTime;
use dotenv::dotenv;

extern crate rsd_encrypt;

use rsd_encrypt::{decrypt, encrypt, legacy_decrypt};

#[tauri::command]
fn get_data(handle: tauri::AppHandle, password: String) -> Result<String, String> {
    let file = open_file(&handle, false);

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
        Err(error) => Err(error.to_string()),
    };
}

#[tauri::command]
fn save_data(handle: tauri::AppHandle, data: String, password: String) -> Result<(), String> {
    let content: String = data;

    let encrypted_content = encrypt(content, password);
    let file: Result<File, Error> = open_file(&handle, true);

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

#[tauri::command]
fn set_save_data(handle: tauri::AppHandle, path: String, is_legacy: bool, password: String) -> Result<(), String> {
    /*let main_file = open_file(&handle, true);

    let main_file = match main_file {
        Ok(file) => file,
        Err(error) => return Err(error.to_string()),
    };*/

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
            Err(error) => return Err(error.to_string()),
        };
    } else {
        decrypted_content = match decrypt(content.clone(), password.clone()) {
            Ok(content) => content,
            Err(error) => return Err(error.to_string()),
        };
    }

    match save_data(handle, decrypted_content.clone(), password) {
        Ok(_) => Ok(()),
        Err(error) => Err(error.to_string()),
    }

    /*let write_result = write_all_content(main_file, content.as_str());

    match write_result {
        Ok(_) => Ok(()),
        Err(error) => Err(error.to_string()),
    }*/
}

#[tauri::command]
fn copy_save_data(handle: tauri::AppHandle, mut path: String) -> Result<String, String> {
    let main_file = open_file(&handle, false);

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

fn file_error(error: Error) -> String {
    "FORCED CLOSURE FILE ERROR ".to_string() + error.to_string().as_str()
}

fn open_file(handle: &tauri::AppHandle, truncate: bool) -> Result<File, Error> {
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


#[tauri::command]
async fn send_code_setup(handle: tauri::AppHandle, phone_number:String) -> Result<String, String> {
    let password = dotenv::var("SERVER_KEY").unwrap();
    let enc_phone_number = encrypt(phone_number, password.clone());
    
    let url = format!("http://127.0.0.1:8000/{}", enc_phone_number.replace('/', "%2F"));

    let res = match reqwest::get(url).await {
        Ok(res) => res.text().await,
        Err(error) => return Err(error.to_string()),
    };

    match res {
        Ok(res) => {
            println!("{}", decrypt(res.clone(), password.clone()).unwrap());
            return Ok(decrypt(res.clone(), password).unwrap());
        },
        Err(error) => Err(error.to_string()),
    }
}

/*#[tauri::command]
fn add_phone_number(handle: tauri::AppHandle, phone_number:String) -> Result<(), String> {
    
    Ok(())    
}*/