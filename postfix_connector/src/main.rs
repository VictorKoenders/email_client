//! This is a simple CLI tool that connects an IMAP+SMTP server with a postgres database.
//!
//! Several properties should be configured. See `.env.example` for each value and a description.
//!
//! This program will connect to the given IMAP server every minute, and retrieve any emails that are unread. It will store each email in the postgres database and mark the email as read in IMAP.
//!
//! In addition, the postgres database will be checked on outgoing emails that should be send but have not been send yet. These emails will be send to the SMTP server.

#![feature(never_type)]

use database::diesel::{Connection, PgConnection};
use failure::{bail, format_err, ResultExt};
use hashbrown::HashMap;
use native_tls::TlsConnector;
use std::fs::File;
use std::io::Write;
use std::path::{Path, PathBuf};

pub type SecureStream = native_tls::TlsStream<std::net::TcpStream>;

fn main() {
    dotenv::dotenv().expect("Could not parse .env");
    loop {
        if let Err(e) = run() {
            println!("{:?}", e);
        }
    }
}

macro_rules! get_env {
    ($name:tt) => {
        std::env::var(stringify!($name)).expect(concat!("Missing env var ", stringify!($name)))
    };
    ($name:tt as $ty:ty) => {
        std::env::var(stringify!($name))
            .expect(concat!("Missing env var ", stringify!($name)))
            .parse::<$ty>()
            .expect(concat!(stringify!($name), " is not a valid value"))
    };
}

struct Config {
    pub imap: ImapConfig,
    pub smtp: SmtpConfig,
    pub database_url: String,
}

impl Default for Config {
    fn default() -> Config {
        Config {
            imap: ImapConfig::default(),
            smtp: SmtpConfig::default(),
            database_url: get_env!(DATABASE_URL),
        }
    }
}

struct ImapConfig {
    pub domain: String,
    pub port: u16,
    pub host: String,
    pub username: String,
    pub password: String,
}
impl Default for ImapConfig {
    fn default() -> ImapConfig {
        ImapConfig {
            domain: get_env!(IMAP_DOMAIN),
            port: get_env!(IMAP_PORT as u16),
            host: get_env!(IMAP_HOST),
            username: get_env!(IMAP_USERNAME),
            password: get_env!(IMAP_PASSWORD),
        }
    }
}

struct SmtpConfig {
    pub domain: String,
    pub port: u16,
    pub host: String,
    pub username: String,
    pub password: String,
}

impl Default for SmtpConfig {
    fn default() -> SmtpConfig {
        SmtpConfig {
            domain: get_env!(SMTP_DOMAIN),
            port: get_env!(SMTP_PORT as u16),
            host: get_env!(SMTP_HOST),
            username: get_env!(SMTP_USERNAME),
            password: get_env!(SMTP_PASSWORD),
        }
    }
}

fn run() -> Result<!, failure::Error> {
    let config = Config::default();

    let socket_addr = format!("{}:{}", config.imap.host, config.imap.port);

    println!(
        "Connecting to {:?} (domain: {:?})",
        socket_addr, config.imap.domain
    );

    let ssl_connector = TlsConnector::builder()
        .build()
        .expect("Could not instantiate TLS connection");
    let mut client = imap::connect(socket_addr, &config.imap.domain, &ssl_connector)
        .expect("Could not create a secure client")
        .login(&config.imap.username, &config.imap.password)
        .expect("Could not log in");

    client.select("INBOX").expect("Could not get INBOX");

    println!("Connected!");

    let connection = PgConnection::establish(&config.database_url)
        .expect("Could not connect to the postgres server");

    loop {
        // read_messages_from_imap(&mut client, &connection)?;
        let result = client.fetch("1:*", "UID")?;
        for key in result.into_iter() {
            load_imap_message(&mut client, key.uid.unwrap())?;
        }
        // load_imap_message(&mut client, 146)?;
        // std::thread::sleep(std::time::Duration::from_secs(60));
        std::process::exit(0);
    }
}

#[derive(Debug)]
pub struct MailPart {
    pub headers: HashMap<String, String>,
    pub body: Vec<u8>,
}

fn read_messages_from_imap(
    client: &mut imap::Session<SecureStream>,
    _connection: &PgConnection,
) -> Result<(), failure::Error> {
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
    println!("[MailReader] Parsing IMAP email {:?}", keys);

    for key in keys {
        load_imap_message(client, key)
            .with_context(|e| format!("Could not load imap message {}: {:?}", key, e))?;
    }

    Ok(())
}

fn load_imap_message(
    client: &mut imap::Session<SecureStream>,
    key: u32,
) -> Result<(), failure::Error> {
    let messages = client.fetch(&key.to_string(), "RFC822")?;
    assert_eq!(1, messages.len());
    if !Path::new("output").exists() {
        std::fs::create_dir("output")?;
    }
    for message in &messages {
        let dir = PathBuf::from(format!("output/{}", key));
        if dir.exists() {
            std::fs::remove_dir_all(&dir)?;
        }
        std::fs::create_dir(&dir)?;
        File::create(&format!("{}/raw.txt", dir.to_str().unwrap()))
            .unwrap()
            .write_all(message.body().unwrap())
            .unwrap();
        if let Some(body) = message.body() {
            if let Ok(mail) = mailparse::parse_mail(body) {
                let mut flat_mail = Vec::new();
                flatten_parsed_mail(&mut flat_mail, &mail);

                let mut mail = Mail::default();
                for part in &flat_mail {
                    save_part(part, &mut mail)
                        .with_context(|e| format_err!("Could not save part {:?}: {:?}", part, e))?;
                }

                std::fs::File::create(&format!("{}/parsed.txt", dir.to_str().unwrap()))
                    .unwrap()
                    .write_fmt(format_args!("{:#?}", mail))
                    .unwrap();
            }
        }
    }

    Ok(())
}

#[derive(Default, Debug)]
pub struct Mail {
    pub headers: HashMap<String, String>,
    pub body_text: Option<Attachment>,
    pub body_html: Option<Attachment>,
    pub attachments: Vec<Attachment>,
}

#[derive(Debug)]
pub struct Attachment {
    pub headers: HashMap<String, String>,
    pub r#type: AttachmentType,
    pub file_name: Option<String>,
    pub body: Vec<u8>,
}

#[derive(Debug)]
pub enum AttachmentType {
    TextHtml,
    TextPlain,
    Image,
    Application,
    Message,
    Unknown,
}

// TODO: get rid of a lot of the string allocations
fn save_part(part: &mailparse::ParsedMail, mail: &mut Mail) -> Result<(), failure::Error> {
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
                    r#type: AttachmentType::TextHtml,
                    file_name: None,
                    body: raw_body,
                });
            }
            "text/plain" => {
                assert!(mail.body_text.is_none());
                mail.body_text = Some(Attachment {
                    headers,
                    r#type: AttachmentType::TextPlain,
                    file_name: None,
                    body: raw_body,
                });
            }
            ref x if x.starts_with("image/") => {
                let name = try_get_attachment_name(name);
                mail.attachments.push(Attachment {
                    headers,
                    r#type: AttachmentType::Image,
                    file_name: name.map(String::from),
                    body: raw_body,
                });
            }
            ref x if x.starts_with("application/") => {
                let name = try_get_attachment_name(name);
                mail.attachments.push(Attachment {
                    headers,
                    r#type: AttachmentType::Application,
                    file_name: name.map(String::from),
                    body: raw_body,
                });
            }
            ref x if x.starts_with("message/") => {
                let name = try_get_attachment_name(name);
                mail.attachments.push(Attachment {
                    headers,
                    r#type: AttachmentType::Message,
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
                    r#type: AttachmentType::TextHtml,
                    file_name: None,
                    body: body.bytes().collect(),
                });
                return Ok(());
            }
        }
        assert!(mail.body_text.is_none());
        mail.body_html = Some(Attachment {
            headers,
            r#type: AttachmentType::TextPlain,
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

impl<'a> From<&'a mailparse::ParsedMail<'a>> for MailPart {
    fn from(mail: &'a mailparse::ParsedMail<'a>) -> MailPart {
        let body = mail.get_body_raw().expect("Could not decode mail body");
        let mut part = MailPart {
            body,
            headers: HashMap::with_capacity(mail.headers.len()),
        };

        for header in &mail.headers {
            part.headers
                .insert(header.get_key().unwrap(), header.get_value().unwrap());
        }
        part
    }
}
fn flatten_parsed_mail<'a>(
    buffer: &mut Vec<&'a mailparse::ParsedMail<'a>>,
    item: &'a mailparse::ParsedMail<'a>,
) {
    buffer.push(item.into());
    for child in &item.subparts {
        flatten_parsed_mail(buffer, child);
    }
}

fn write_part_to_file(
    key: u32,
    file: &mut std::fs::File,
    part: &mailparse::ParsedMail,
    indent: usize,
    depth: &mut usize,
) -> Result<(), failure::Error> {
    *depth = (*depth).max(indent / 2);
    let prefix = String::from(" ").repeat(indent);
    file.write_fmt(format_args!("{}headers:\n", prefix))?;
    for header in &part.headers {
        file.write_fmt(format_args!(
            "{} - {}: {}\n",
            prefix,
            header.get_key().unwrap(),
            header.get_value().unwrap()
        ))?;
    }
    if let Ok(body) = part.get_body() {
        if !body.is_empty() {
            file.write_fmt(format_args!("{}{}\n", prefix, body))?;
        }
    } else {
        file.write_fmt(format_args!("{}<body is invalid>\n", prefix))?;
    }
    file.write_fmt(format_args!(
        "{}Sub parts: ({})\n",
        prefix,
        part.subparts.len()
    ))?;
    for sub in &part.subparts {
        write_part_to_file(key, file, sub, indent + 2, depth)?;
    }
    Ok(())
}
