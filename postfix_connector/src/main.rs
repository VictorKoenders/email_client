//! This is a simple CLI tool that connects an IMAP+SMTP server with a postgres database.
//!
//! Several properties should be configured. See `.env.example` for each value and a description.
//!
//! This program will connect to the given IMAP server every minute, and retrieve any emails that are unread. It will store each email in the postgres database and mark the email as read in IMAP.
//!
//! In addition, the postgres database will be checked on outgoing emails that should be send but have not been send yet. These emails will be send to the SMTP server.

#![feature(never_type)]

use database::diesel::{Connection, PgConnection};
use database::email_part::EmailPartType;
use failure::{bail, format_err, ResultExt};
use hashbrown::HashMap;
use native_tls::TlsConnector;

type SecureStream = native_tls::TlsStream<std::net::TcpStream>;
type Result<T> = std::result::Result<T, failure::Error>;

mod config;
mod data;

use config::*;
use data::*;

fn main() {
    dotenv::dotenv().expect("Could not parse .env");
    loop {
        if let Err(e) = run() {
            println!("{:?}", e);
        }
        std::thread::sleep(std::time::Duration::from_secs(5));
    }
}

fn run() -> Result<!> {
    let config = Config::default();

    let socket_addr = format!("{}:{}", config.imap.host, config.imap.port);

    println!(
        "Connecting to {:?} (domain: {:?})",
        socket_addr, config.imap.domain
    );

    let ssl_connector = TlsConnector::builder()
        .build()
        .context("Could not instantiate TLS connection")?;
    let mut client = imap::connect(socket_addr, &config.imap.domain, &ssl_connector)
        .context("Could not create a secure client")?
        .login(&config.imap.username, &config.imap.password)
        .map_err(|e| format_err!("Could not log in: {:?}", e))?;

    client.select("INBOX").context("Could not get INBOX")?;

    println!("Connected!");

    let connection = PgConnection::establish(&config.database_url)
        .context("Could not connect to the postgres server")?;

    loop {
        read_messages_from_imap(&mut client, &connection)?;
        /*let result = client.fetch("1:*", "UID")?;
        for key in result.into_iter() {
            let id = key.uid.unwrap();
            if let Err(e) = load_imap_message(&mut client, &connection, id) {
                eprintln!("Could not load imap message {:}", id);
                eprintln!("{:?}", e);
            }
        }*/
        // load_imap_message(&mut client, &connection, 82)?;
        std::thread::sleep(std::time::Duration::from_secs(60));
        // std::process::exit(0);
    }
}

fn read_messages_from_imap(
    client: &mut imap::Session<SecureStream>,
    connection: &PgConnection,
) -> Result<()> {
    let result: Vec<u8> = client
        .run_command_and_read_response("SEARCH UNSEEN")
        .context("Could not execute \"SEARCH UNSEEN\"")?;
    let str = std::str::from_utf8(&result).context("Could not parse IMAP message as valid utf8")?;

    const SEARCH_PREFIX: &str = "* SEARCH";
    if !str.starts_with(SEARCH_PREFIX) {
        bail!("Expected {:?}, got {:?}", SEARCH_PREFIX, str);
    }
    let newline = str.find("\r\n").unwrap_or_else(|| str.len());
    let keys: Vec<_> = str[SEARCH_PREFIX.len()..newline]
        .trim()
        .split(' ')
        .filter_map(|s| s.parse().ok()) // !s.trim().is_empty())
        .collect();
    if keys.is_empty() {
        return Ok(());
    }
    println!("[MailReader] Parsing IMAP emails {:?}", keys);

    for key in keys {
        if let Err(e) = load_imap_message(client, connection, key) {
            eprintln!("Could not load imap message {}", key);
            eprintln!("{:?}", e);
        }
    }

    Ok(())
}

fn load_imap_message(
    client: &mut imap::Session<SecureStream>,
    connection: &PgConnection,
    key: i64,
) -> Result<()> {
    println!("{:?}", key);
    let messages = client.fetch(&key.to_string(), "RFC822")?;
    if messages.len() != 1 {
        bail!(
            "Could not parse imap message {}; expected 1 message, got {}",
            key,
            messages.len()
        );
    }

    // this will never fail because we check for messages.len() above
    let message = messages.into_iter().next().unwrap();

    if let Some(body) = message.body() {
        match mailparse::parse_mail(body) {
            Ok(mail) => {
                let mut flat_mail = Vec::new();
                flatten_parsed_mail(&mut flat_mail, &mail);

                let mut mail = Mail::new(key as u64);
                for part in &flat_mail {
                    save_part(part, &mut mail)
                        .with_context(|e| format_err!("Could not save part {:?}: {:?}", part, e))?;
                }

                if let Err(e) = mail.save(connection) {
                    eprintln!("Could not save email with IMAP id {}", key);
                    eprintln!("{:?}", e);
                }
            }
            Err(e) => {
                eprintln!("Could not parse Imap message {}", key);
                eprintln!("{:?}", e);
            }
        }
    } else {
        eprintln!("Imap message {} has no body", key);
    }

    Ok(())
}

fn save_part(part: &mailparse::ParsedMail, mail: &mut Mail) -> Result<()> {
    let raw_body = part
        .get_body_raw()
        .context("Could not get mail part body")?;
    let body = std::str::from_utf8(&raw_body).ok();
    if part.headers.len() == 1 && body.unwrap_or("").trim().is_empty() {
        // println!("[IGNORE] Empty part found: {:?}", part);
        return Ok(());
    }
    let mut headers = HashMap::with_capacity(part.headers.len());
    for header in &part.headers {
        if let (Ok(key), Ok(value)) = (header.get_key(), header.get_value()) {
            headers.insert(key, value);
        }
    }
    if let Some(content_type) = headers.get("Content-Type") {
        let mut actual_content_type = content_type.as_str();
        let mut name = None;
        if let Some(index) = content_type.chars().position(|c| c == ';') {
            actual_content_type = &content_type[..index];
            name = Some(&content_type[index + 1..]);
        }
        match actual_content_type {
            "text/html" => {
                assert!(mail.body_html.is_none());
                mail.body_html = Some(Attachment {
                    headers,
                    r#type: EmailPartType::TextHtml,
                    file_name: None,
                    body: raw_body,
                });
            }
            "text/plain" => {
                assert!(mail.body_text.is_none());
                mail.body_text = Some(Attachment {
                    headers,
                    r#type: EmailPartType::TextPlain,
                    file_name: None,
                    body: raw_body,
                });
            }
            ref x if x.starts_with("image/") => {
                let name = try_get_attachment_name(name);
                mail.attachments.push(Attachment {
                    headers,
                    r#type: EmailPartType::Image,
                    file_name: name.map(String::from),
                    body: raw_body,
                });
            }
            ref x if x.starts_with("application/") => {
                let name = try_get_attachment_name(name);
                mail.attachments.push(Attachment {
                    headers,
                    r#type: EmailPartType::Application,
                    file_name: name.map(String::from),
                    body: raw_body,
                });
            }
            ref x if x.starts_with("message/") => {
                let name = try_get_attachment_name(name);
                mail.attachments.push(Attachment {
                    headers,
                    r#type: EmailPartType::Message,
                    file_name: name.map(String::from),
                    body: raw_body,
                });
            }
            _ if raw_body.is_empty()
                || raw_body == b"\r\n"
                || slice_in_slice(&raw_body, &b"MIME"[..]) =>
            {
                for (key, value) in headers {
                    mail.headers.insert(key, value);
                }
            }
            _ => {
                println!("Found {:?} ({:?})", actual_content_type, name);
                println!("With headers: {:?}", part.headers);
                println!("With body {:?}", body);

                println!();
                println!();
            }
        }
    } else {
        let body = body
            .map(|s| s.to_owned())
            .unwrap_or_else(|| String::from_utf8_lossy(&raw_body).into_owned());
        if let Some(content_type) = headers.get("content-type") {
            if content_type.starts_with("text/html") {
                assert!(mail.body_html.is_none());
                mail.body_html = Some(Attachment {
                    headers,
                    r#type: EmailPartType::TextHtml,
                    file_name: None,
                    body: body.bytes().collect(),
                });
                return Ok(());
            }
        }
        assert!(mail.body_text.is_none());
        mail.body_text = Some(Attachment {
            headers,
            r#type: EmailPartType::TextPlain,
            file_name: None,
            body: body.bytes().collect(),
        });
        return Ok(());
    }
    Ok(())
}

fn try_get_attachment_name(name: Option<&str>) -> Option<String> {
    if let Some(name) = name {
        // TODO: Make this parsing better
        if let Some(index) = name.chars().position(|c| c == '=') {
            let name = &name[index + 1..].trim().trim_matches('"');
            return Some(name.to_string());
        }
    }
    None
}

fn slice_in_slice(haystack: &[u8], needle: &[u8]) -> bool {
    for i in 0..haystack.len() - needle.len() {
        if &haystack[i..i + needle.len()] == needle {
            return true;
        }
    }
    false
}

fn flatten_parsed_mail<'a>(
    buffer: &mut Vec<&'a mailparse::ParsedMail<'a>>,
    item: &'a mailparse::ParsedMail<'a>,
) {
    buffer.push(item);
    for child in &item.subparts {
        flatten_parsed_mail(buffer, child);
    }
}
