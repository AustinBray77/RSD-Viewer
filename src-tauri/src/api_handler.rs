use reqwest::Response;
use rsd_encrypt::{encrypt, decrypt};

pub async fn send_api_request(path: String) -> Result<Response, String> {
    let address: String = dotenv::var("SERVER_ADDRESS").unwrap();
    let url = format!("{}/api/{}", address, path);
    
    let result = reqwest::Client::builder()
        .danger_accept_invalid_certs(true)
        .build()
        .unwrap()
        .get(&url)
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
    let api_result = send_api_request(hashified_number).await;

    let api_response = match api_result {
        Ok(res) => res,
        Err(error) => return Err(error),
    };

    let code = match api_response.text().await {
        Ok(text) => text,
        Err(error) => return Err(error.to_string()),
    };

    Ok(code)
}

pub fn server_encrypt(data: String) -> String {
    let password = dotenv::var("SERVER_KEY").unwrap();
    encrypt(data, password)
}

pub fn server_decrypt(data: String) -> Result<String, String> {
    let password = dotenv::var("SERVER_KEY").unwrap();
    let decrypt_result = decrypt(data, password);

    match decrypt_result {
        Ok(res) => Ok(res),
        Err(error) => Err(error.to_string()),
    }
}