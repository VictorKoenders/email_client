extern crate actix;
extern crate actix_web;
extern crate dotenv;
extern crate failure;
extern crate imap;
extern crate mailparse;
extern crate native_tls;

mod web;

use std::collections::HashMap;
use std::thread::sleep;
use std::time::Duration;

pub type Result<T> = std::result::Result<T, failure::Error>;

fn main() {
    web::serve();
    loop {
        sleep(Duration::from_secs(5));
    }
}

#[derive(Debug)]
pub struct Message {
    pub headers: HashMap<String, String>,
    pub content: Vec<String>,
    pub from: Option<String>,
    pub to: Option<String>,
    pub subject: Option<String>,
    pub body: Vec<String>,
    //pub raw: Vec<u8>,
}
