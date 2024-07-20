//extern crate embed_resource;
use dotenv::dotenv;

fn main() {
    dotenv().ok();

    let platform = dotenv::var("BUILD_PLATFORM").unwrap();

    println!("Building for platform: {}", platform);

    if platform == "windows"
    {

        let mut windows = tauri_build::WindowsAttributes::new();

        windows = windows.app_manifest(
           r#"
<assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0">
  <trustInfo xmlns="urn:schemas-microsoft-com:asm.v3">
      <security>
          <requestedPrivileges>
              <requestedExecutionLevel level="requireAdministrator" uiAccess="false" />
          </requestedPrivileges>
      </security>
  </trustInfo>
</assembly>
"#,
        );

        let attributes = tauri_build::Attributes::new().windows_attributes(windows);

        tauri_build::try_build(attributes).expect("failed to build");
    } else {
        tauri_build::build();
    }
}
