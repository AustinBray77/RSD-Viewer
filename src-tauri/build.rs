//extern crate embed_resource;

mod src;
use std::{fs::{self}, io::Read};

use src::environment;

fn build_windows() {
    let mut windows = tauri_build::WindowsAttributes::new();

    let mut manifest_file = 
        fs::OpenOptions::new()
        .read(true)
        .open("./windows_manifest.xml")
        .expect("Error opening manifest file");

    let mut manifest_str = String::new();
    
    manifest_file.read_to_string(&mut manifest_str).expect("Error parsing manifest file");

    windows = windows.app_manifest(manifest_str);

    let attributes = tauri_build::Attributes::new().windows_attributes(windows);

    tauri_build::try_build(attributes).expect("failed to build");
}

fn build_linux() {
    tauri_build::build();
}

fn main() {
    let platform = environment::ENV_VARS.BUILD_PLATFORM.clone();

    println!("Building for platform: {:?}", platform);

    match platform {
        environment::BuildPlatform::Windows => {
            build_windows();
        },
        environment::BuildPlatform::Linux => {
            build_linux();
        }
        
    }
}
