extern crate magic_crypt;

use magic_crypt::{new_magic_crypt, MagicCryptTrait};
use std::io::Error;

pub fn encrypt(data: String, pk: String) -> String {
    let encryptor = new_magic_crypt!(pk, 256);
    let res = encryptor.encrypt_str_to_base64(data);
    return res;
}

pub fn decrypt(data: String, pk: String) -> Result<String, Error> {
    if data.is_empty() {
        return Ok(String::new());
    }

    let decryptor = new_magic_crypt!(pk, 256);
    let result = decryptor.decrypt_base64_to_string(data);

    return match result {
        Ok(x) => Ok(x),
        Err(e) => Err(Error::new(
            std::io::ErrorKind::Other,
            e.to_string() + " ENC-16",
        )),
    };
}
