use attachment::Attachment;
use failure::ResultExt;
use mail_reader::Client;
use mailparse::{parse_mail, ParsedMail};
use std::collections::HashMap;
use Result;

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
                debug_assert!(!message.from.is_empty());
                debug_assert!(!message.to.is_empty());
                debug_assert!(!message.subject.is_empty());

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
                    if attachment.ctype.mimetype.starts_with("multipart/") {
                        match attachment.get_body() {
                            Ok(ref s) if !s.trim().is_empty() => {
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

    /*
    fn append(&mut self, part: &ParsedMail) -> Result<()> {
        for header in &part.headers {
            let key = header.get_key().context("Could not get header key")?;
            let value = header.get_value().context("Could not get header value")?;
            if key.to_lowercase() == "from" {
                self.from = Some(value.clone());
            } else if key.to_lowercase() == "to" {
                self.to = Some(value.clone());
            } else if key.to_lowercase() == "subject" {
                self.subject = Some(value.clone());
            }
            *self.headers.entry(key).or_insert_with(String::new) += &value;
        }
        if let Ok(body) = part.get_body() {
            self.content.push(body);
        }
        for sub in &part.subparts {
            self.append(sub).context("Could not get ParsedMail sub")?;
        }
        Ok(())
    }*/
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
