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
extern crate chrono;
extern crate r2d2;
extern crate r2d2_diesel;
extern crate serde;
extern crate serde_json;
extern crate uuid;
#[macro_use]
extern crate diesel;
extern crate clap;

pub mod attachment;
pub mod data;
pub mod mail_reader;
pub mod message;
pub mod web;

use actix::{ArbiterService, System};
use clap::{App, Arg};

pub type Result<T> = std::result::Result<T, failure::Error>;

fn main() {
    dotenv::dotenv().expect("Could not load .env file");

    let matches = App::new("Email")
        .arg(
            Arg::with_name("reset")
                .long("reset")
                .help("Resets all emails and the database, then exits"),
        )
        .get_matches();

    if matches.is_present("reset") {
        data::Database::clear();
        mail_reader::reset();
        return;
    }

    let runner = System::new("Email server");

    let ws_server = web::WebsocketServer::start_service();
    let database = data::Database::start_service();
    let email_parser = mail_reader::EmailParser::start_service();

    {
        let recipient = database.clone().recipient();
        email_parser
            .clone()
            .recipient()
            .do_send(mail_reader::AddListener(recipient))
            .expect("Could not register ws server to database");
    }
    {
        let recipient = ws_server.clone().recipient();
        database
            .clone()
            .recipient()
            .do_send(data::AddNewEmailListener(recipient))
            .expect("Could not register ws server to database");
    }

    web::serve(ws_server, database);

    runner.run();
}
