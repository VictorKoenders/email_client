use failure::ResultExt;
use message::Message;
use native_tls::{Pkcs12, TlsConnector};
use std::env;
use std::fs::File;
use std::io::Read;
use std::str;
use std::sync::mpsc::{channel, Receiver};
use std::thread::{sleep, spawn};
use std::time::Duration;
use Result;

pub type Client = ::imap::client::Client<::native_tls::TlsStream<::std::net::TcpStream>>;

#[derive(Debug)]
pub enum ImapMessage {
    NewMessage(Message),
}

pub fn run(run_mock: bool) -> Receiver<ImapMessage> {
    let (sender, receiver) = channel();
    if run_mock {
        spawn(move || loop {
            for msg in generate_mock() {
                sender.send(msg).unwrap();
            }
            sleep(Duration::from_secs(2));
        });
    } else {
        spawn(move || {
            let mut client = init_client().expect("Could not connect to IMAP");
            loop {
                for msg in update(&mut client).expect("Could not update IMAP client") {
                    sender.send(msg).unwrap();
                }
                sleep(Duration::from_secs(2));
            }
        });
    }

    receiver
}

fn generate_mock() -> Vec<ImapMessage> {
    vec![ImapMessage::NewMessage(Message::mock())]
}

fn init_client() -> Result<Client> {
    let imap_domain = env::var("IMAP_DOMAIN").expect("Missing env var IMAP_DOMAIN");
    let imap_port: u16 = env::var("IMAP_PORT")
        .expect("Missing env var IMAP_PORT")
        .parse()
        .expect("IMAP_PORT is not a valid unsigned int");
    let imap_host = env::var("IMAP_HOST").expect("Missing env var IMAP_HOST");
    let imap_pfx_file = env::var("IMAP_PFX_FILE").expect("Missing env var IMAP_PFX_FILE");
    let imap_pfx_file_password =
        env::var("IMAP_PFX_FILE_PASSWORD").expect("Missing env var IMAP_PFX_FILE_PASSWORD");
    let imap_username = env::var("IMAP_USERNAME").expect("Missing env var IMAP_USERNAME");
    let imap_password = env::var("IMAP_PASSWORD").expect("Missing env var IMAP_PASSWORD");
    let socket_addr = (imap_host.as_str(), imap_port);

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
    let mut imap_socket = Client::secure_connect(socket_addr, &imap_domain, &ssl_connector)
        .context("Could not create a secure client")?;

    imap_socket.login(&imap_username, &imap_password).unwrap();
    Ok(imap_socket)
}

fn update(client: &mut Client) -> Result<Vec<ImapMessage>> {
    let result = client
        .run_command_and_read_response("SEARCH UNSEEN")
        .context("Could not execute \"SEARCH UNSEEN\"")?;
    let str = str::from_utf8(&result).context("Could not parse IMAP message as valid utf8")?;

    const SEARCH_PREFIX: &str = "* SEARCH";
    if !str.starts_with(SEARCH_PREFIX) {
        bail!("Expected {:?}, got {:?}", SEARCH_PREFIX, str);
    }
    let keys: Vec<_> = str[SEARCH_PREFIX.len()..].trim().split(' ').collect();
    let mut result = Vec::with_capacity(keys.len());

    for key in keys {
        let messages = client
            .fetch(key, "RFC822")
            .with_context(|e| format!("Could not fetch IMAP message {}: {}", key, e))?;
        if messages.len() != 1 {
            println!("Mail {} has more than one message", key);
        }
        for message in messages.iter() {
            if let Some(rfc822) = message.rfc822() {
                result.push(ImapMessage::NewMessage(
                    Message::from(&rfc822).context("Could not parse Message")?,
                ));
            }
        }
    }
    Ok(result)
}
