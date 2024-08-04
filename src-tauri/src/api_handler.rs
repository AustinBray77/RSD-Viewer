use reqwest::{header::{HeaderMap, HeaderValue}, Response, StatusCode};
use rsd_encrypt::{encrypt, decrypt};

use crate::environment;

pub async fn send_api_request(path: &str, headers: HeaderMap) -> Result<Response, String> {
    let address: String = environment::ENV_VARS.SERVER_ADDRESS.to_string();
    let url = format!("{}/api/{}", address, path);
    
    let result = reqwest::Client::builder()
        .danger_accept_invalid_certs(true)
        .build()
        .unwrap()
        .get(&url)
        .headers(headers)
        .send()
        .await;

    match result {
        Ok(res) => {
            println!("Res: {}", res.status());
            Ok(res)
        },
        Err(error) => { 
            println!("Reqwest Error? {}", error.to_string());
            return Err("Error communicating the with server, check your connection and try again.".to_string()) 
        },
    }
}

pub async fn query_api_for_code(hashified_number: String) -> Result<String, String> {
    let api_key = environment::ENV_VARS.SERVER_KEY;

    let mut headers = HeaderMap::new();

    headers.append("api-key", HeaderValue::from_str(&api_key).unwrap());
    headers.append("phone-number", HeaderValue::from_str(&hashified_number).unwrap());
    
    let api_result = send_api_request("send-tfa-code", headers).await;

    let api_response = match api_result {
        Ok(res) => res,
        Err(error) => return Err(error),
    };

    if api_response.status() != StatusCode::OK {
        return Err("Error communicating with the server, check your connection and try again...".to_string());
    }

    let code = match api_response.text().await {
        Ok(text) => text,
        Err(error) => return Err(error.to_string()),
    };

    Ok(code)
}

pub fn server_encrypt(data: String) -> String {
    let password = environment::ENV_VARS.SERVER_KEY.to_string();
    encrypt(data, password)
}

pub fn server_decrypt(data: String) -> Result<String, String> {
    let password = environment::ENV_VARS.SERVER_KEY.to_string();
    let decrypt_result = decrypt(data, password);

    match decrypt_result {
        Ok(res) => Ok(res),
        Err(error) => Err(error.to_string()),
    }
}