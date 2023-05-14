extern crate sha2;

use sha2::{Digest, Sha256};
use std::str;

const Salt: &str = "100191480193847518309";

fn gen_salt(offset: u8) -> String {
    let mut i: u8 = 1;
    let mut output = String::new();

    while i < offset {
        output += (((offset << i) * offset / i) as char).to_string().as_str();
        i += 1;
    }

    return output;
}

fn encrypt_raw(data: &[u8]) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(data);

    return Vec::new();
}

pub fn encrypt(data: String, pk: String) -> String {
    let data = encrypt_raw((pk + &data).as_bytes());
    let s = str::from_utf8(&data).unwrap();
    return s.to_string();
}

fn decrypt_raw(data: &[u8], pk: String) -> Vec<u8> {
    return Vec::new();
}

pub fn decrypt(data: String, pk: String) -> String {
    let data = decrypt_raw(data.as_bytes(), pk);
    let s = str::from_utf8(&data).unwrap();
    return s.to_string();
}
