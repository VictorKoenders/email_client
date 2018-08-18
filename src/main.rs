extern crate dotenv;
extern crate imap;
extern crate mailparse;
extern crate native_tls;
#[macro_use]
extern crate failure;

mod mail_reader;
mod message;

type Result<T> = std::result::Result<T, failure::Error>;

fn main() {
    dotenv::dotenv().expect("Could not load .env file");

    let mut use_mock_mail_server = false;

    for var in std::env::args() {
        if var == "--mock" {
            use_mock_mail_server = true;
        }
    }

    let receiver = mail_reader::run(use_mock_mail_server);

    while let Ok(msg) = receiver.recv() {
        println!("{:?}", msg);
    }

    println!("Done");
}
