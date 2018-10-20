use crate::attachment::Attachment;
use crate::mail_reader::Client;
use crate::Result;
use failure::ResultExt;
use lettre::smtp::authentication::{Credentials, Mechanism};
use lettre::smtp::extension::ClientId;
use lettre::smtp::SmtpTransportBuilder;
use lettre::{ClientSecurity, EmailTransport};
use lettre_email::EmailBuilder;
use mailparse::{parse_mail, ParsedMail};
use std::collections::HashMap;
use std::env;

#[derive(Clone, Debug, Serialize, Default)]
pub struct Message {
    pub headers: HashMap<String, String>,
    pub imap_index: i32,
    pub from: String,
    pub to: String,
    pub subject: String,
    pub plain_text_body: String,
    pub html_body: Option<String>,
    pub html_body_raw: Option<String>,
    pub attachments: Vec<Attachment>,
    pub raw: Vec<u8>,
}
fn flatten<'a>(mail: &'a ParsedMail<'a>) -> Vec<&'a ParsedMail<'a>> {
    let mut result = vec![mail];
    for subpart in &mail.subparts {
        for subpart in &flatten(subpart) {
            result.push(subpart);
        }
    }
    result
}

impl Message {
    pub fn read(client: &mut Client, imap_index: i32) -> Result<Vec<Message>> {
        let messages = client
            .fetch(&format!("{}", imap_index), "RFC822")
            .with_context(|e| format!("Could not fetch IMAP message {}: {}", imap_index, e))?;
        let mut result = Vec::with_capacity(messages.len());
        for message in &messages {
            if let Some(rfc822) = message.rfc822() {
                let mail = match parse_mail(rfc822) {
                    Err(e) => panic!("Could not parse mail: {:?}", e),
                    Ok(m) => m,
                };
                let mut message = Message::default();
                message.imap_index = imap_index;
                message.raw = rfc822.into();

                for header in &mail.headers {
                    if let (Ok(key), Ok(value)) = (header.get_key(), header.get_value()) {
                        if key.to_lowercase() == "from" {
                            message.from = value.clone();
                        } else if key.to_lowercase() == "to" {
                            message.to = value.clone();
                        } else if key.to_lowercase() == "subject" {
                            message.subject = value.clone();
                        }
                        *message.headers.entry(key).or_insert_with(String::new) += &value;
                    } else {
                        bail!(
                            "Could not parse imap_index {:?}: could not parse header ({:?})",
                            imap_index,
                            header
                        )
                    }
                }

                let mail = flatten(&mail);

                message.plain_text_body = match mail
                    .iter()
                    .find(|p| p.ctype.mimetype == "text/plain")
                    .map(|p| p.get_body())
                {
                    Some(Ok(body)) => body,
                    x => format!("Could not retreive text/plain body: {:?}", x),
                };

                if let Some(html_subpart) = mail.iter().find(|p| p.ctype.mimetype == "text/html") {
                    let html_body_raw = match html_subpart.get_body() {
                        Ok(body) => body,
                        Err(e) => bail!(
                            "Could not get text/html body of imap_index {:?}: {:?}",
                            imap_index,
                            e
                        ),
                    };
                    message.html_body = Some(sanitizer(&html_body_raw));
                    message.html_body_raw = Some(html_body_raw);
                }

                for attachment in mail.iter().filter(|part| {
                    part.ctype.mimetype != "text/plain" && part.ctype.mimetype != "text/html"
                }) {
                    const MULTIPART_MIME_MESSAGE: &str =
                        "This is a multi-part message in MIME format.";
                    if attachment.ctype.mimetype.starts_with("multipart/") {
                        match attachment.get_body() {
                            Ok(ref s)
                                if !s.trim().is_empty() && s.trim() != MULTIPART_MIME_MESSAGE =>
                            {
                                message
                                    .attachments
                                    .push(Attachment::from_parsed_mail(attachment)?);
                            }
                            _ => {}
                        }
                        continue;
                    }
                    message
                        .attachments
                        .push(Attachment::from_parsed_mail(attachment)?);
                }

                result.push(message);
            }
        }

        Ok(result)
    }
}

fn sanitizer(input: &str) -> String {
    let mut parser = ::std::io::BufReader::new(input.as_bytes());
    let mut parser = ::html_sanitizer::TagParser::new(&mut parser);
    parser.walk(|tag| {
        if tag.name == "html" || tag.name == "body" {
            tag.ignore_self();
        } else if tag.name == "head" || tag.name == "script" || tag.name == "style" {
            tag.ignore_self_and_contents();
        } else if tag.name == "a" {
            tag.allow_attribute(String::from("href"));
        } else if tag.name == "img" {
            if let Some(url) = tag
                .attrs
                .iter()
                .find(|(key, _)| key == &"src")
                .map(|(_, url)| url)
            {
                let name = match url.rfind('/') {
                    Some(i) => &url[i + 1..],
                    None => "Load image",
                };
                tag.rewrite_as(format!("<a href=\"{0}\" onclick=\"return replace_url_by_image(this);\" title=\"{0}\">{1}</a>", url, name));
            }
        } else {
            tag.allow_attribute(String::from("style"));
        }
    })
}

pub struct Outgoing {
    pub from_email: String,
    pub from_alias: String,
    pub to_email: String,
    pub to_alias: String,
    pub subject: String,
    pub body: String,
}

impl Outgoing {
    pub fn send(self) -> Result<()> {
        let email = EmailBuilder::new()
            .to((self.to_email, self.to_alias))
            // ... or by an address only
            .from((self.from_email, self.from_alias))
            .subject(self.subject)
            .text(self.body)
            .build()
            .unwrap();

        let host = env::var("SMTP_DOMAIN").expect("Missing environment variable SMTP_DOMAIN");
        let port: u16 = env::var("SMTP_PORT")
            .expect("Missing environment variable SMTP_PORT")
            .parse()
            .expect("SMTP_PORT is not a valid port");
        let username =
            env::var("IMAP_USERNAME").expect("Missing environment variable IMAP_USERNAME");
        let password =
            env::var("IMAP_PASSWORD").expect("Missing environment variable IMAP_PASSWORD");

        // Open a local connection on port 25
        let mut mailer = SmtpTransportBuilder::new((host.as_str(), port), ClientSecurity::None)
            .unwrap()
            .hello_name(ClientId::Domain(host))
            .credentials(Credentials::new(username, password))
            .smtp_utf8(true)
            .authentication_mechanism(Mechanism::Plain)
            .build();
        // Send the email
        mailer.send(&email)?;
        Ok(())
    }
}
