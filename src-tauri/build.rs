extern crate embed_resource;

fn main() {
    tauri_build::build();
    //embed_resource::compile("rsd-viewer-manifest.rc", embed_resource::NONE);
}
