extern crate dotenv;
extern crate imap;
extern crate mailparse;
extern crate native_tls;

use imap::client::Client;
use native_tls::{Pkcs12, TlsConnector};
use std::fs::File;
use std::io::Read;

fn main() {
    dotenv::dotenv().expect("Could not load .env file");

    let imap_domain = std::env::var("IMAP_DOMAIN").expect("Missing env var IMAP_DOMAIN");
    let imap_port = std::env::var("IMAP_PORT").expect("Missing env var IMAP_PORT");
    let imap_host = std::env::var("IMAP_HOST").expect("Missing env var IMAP_HOST");
    let imap_pfx_file = std::env::var("IMAP_PFX_FILE").expect("Missing env var IMAP_PFX_FILE");
    let imap_pfx_file_password =
        std::env::var("IMAP_PFX_FILE_PASSWORD").expect("Missing env var IMAP_PFX_FILE_PASSWORD");
    let imap_username = std::env::var("IMAP_USERNAME").expect("Missing env var IMAP_USERNAME");
    let imap_password = std::env::var("IMAP_PASSWORD").expect("Missing env var IMAP_PASSWORD");

    let port = imap_port.parse().expect("IMAP_PORT is not an unsigned int");
    let socket_addr = (imap_host.as_str(), port);

    let mut file =
        File::open(&imap_pfx_file).expect(&format!("Could not open file {:?}", imap_pfx_file));
    let mut identity = vec![];
    file.read_to_end(&mut identity)
        .expect("Could not read pfx file");
    let identity = Pkcs12::from_der(&identity, &imap_pfx_file_password)
        .expect("Could not parse pfx file as PKCS12");
    let mut ssl_connector = TlsConnector::builder().expect("Could not create TLS builder");
    ssl_connector
        .identity(identity)
        .expect("Could not load TLS identity");
    let ssl_connector = ssl_connector
        .build()
        .expect("Could not instantiate TLS connection");
    let mut imap_socket =
        Client::secure_connect(socket_addr, &imap_domain, &ssl_connector).unwrap();

    imap_socket.login(&imap_username, &imap_password).unwrap();

    let mut message_count = 0;

    match imap_socket.select("INBOX") {
        Ok(mailbox) => {
            println!("{}", mailbox);
            message_count = mailbox.exists;
        }
        Err(e) => println!("Error selecting INBOX: {}", e),
    };

    for i in 1..=message_count {
        println!(" --- Fetching {} --- ", i);
        match imap_socket.fetch(&format!("{}", i), "RFC822") {
            Ok(messages) => {
                for message in messages.iter() {
                    match mailparse::parse_mail(message.rfc822().unwrap()) {
                        Ok(msg) => {
                            print_msg(&msg);
                            println!();
                        }
                        Err(e) => {
                            println!("Could not parse email: {}", e);
                        }
                    }
                }
            }
            Err(e) => println!("Error Fetching email: {}", e),
        };
    }

    imap_socket.logout().unwrap();
}

fn print_msg(msg: &mailparse::ParsedMail) {
    for header in &msg.headers {
        if let (Ok(key), Ok(value)) = (header.get_key(), header.get_value()) {
            println!("{}: {}", key, value);
        } else {
            println!("Could not parse header");
        }
    }
    if let Ok(body) = msg.get_body() {
        println!();
        println!("{}", body);
    } else {
        println!("(No body)");
    }
    println!("{:?}", msg.get_content_disposition());

    for sub in &msg.subparts {
        print_msg(sub);
    }
}

