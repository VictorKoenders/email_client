#[macro_use]
extern crate actix;
extern crate actix_web;
extern crate dotenv;
extern crate imap;
extern crate mailparse;
extern crate native_tls;
#[macro_use]
extern crate failure;
extern crate futures;
#[macro_use]
extern crate serde_derive;
extern crate serde;
extern crate serde_json;
#[macro_use]
extern crate diesel;
extern crate uuid;

mod data;
mod mail_reader;
mod message;
mod web;

use actix::{ArbiterService, System};

pub type Result<T> = std::result::Result<T, failure::Error>;

fn main() {
    dotenv::dotenv().expect("Could not load .env file");

    let mut use_mock_mail_server = false;

    for var in std::env::args() {
        if var == "--mock" {
            use_mock_mail_server = true;
        }
    }

    let runner = System::new("Email server");

    let ws_server = web::WebsocketServer::start_service();
    let database = data::Database::start_service();

    mail_reader::run(
        ws_server.clone(),
        database.clone(),
        &runner,
        use_mock_mail_server,
    );
    web::serve(ws_server.clone(), database.clone());

    runner.run();
}
