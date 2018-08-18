extern crate actix;
extern crate actix_web;
extern crate dotenv;
extern crate imap;
extern crate mailparse;
extern crate native_tls;
#[macro_use]
extern crate failure;

mod mail_reader;
mod message;
mod web;

use std::thread::sleep;
use std::time::Duration;

pub type Result<T> = std::result::Result<T, failure::Error>;

fn main() {
    dotenv::dotenv().expect("Could not load .env file");

    let mut use_mock_mail_server = false;

    for var in std::env::args() {
        if var == "--mock" {
            use_mock_mail_server = true;
        }
    }

    let receiver = mail_reader::run(use_mock_mail_server);

    web::serve(receiver);
    loop {
        sleep(Duration::from_secs(5));
    }
}
