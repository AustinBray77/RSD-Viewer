use std::{fs::{File, OpenOptions}, io::{Error, Read, Write}};

pub fn file_error(error: Error) -> String {
    "FORCED CLOSURE FILE ERROR ".to_string() + error.to_string().as_str()
}

pub fn open_file(handle: &tauri::AppHandle, options: &mut OpenOptions) -> Result<File, Error> {
    let path = handle
        .path_resolver()
        .resolve_resource("resources/psd.bin")
        .expect("Failed to resolve file path resource");

    options.open(path)
}

pub fn read_all_content(mut file: File) -> Result<String, Error> {
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    Ok(contents)
}

pub fn write_all_content(mut file: File, content: &str) -> Result<(), Error> {
    file.write_all(content.as_bytes())
}
