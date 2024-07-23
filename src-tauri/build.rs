//extern crate embed_resource;

mod src;
use src::environment;

fn main() {
    let platform = environment::ENV_VARS.BUILD_PLATFORM.clone();

    println!("Building for platform: {:?}", platform);

    match platform {
        environment::BuildPlatform::Windows => {
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
        },
        environment::BuildPlatform::Linux => {
            tauri_build::build();
        }
        
    }
}
