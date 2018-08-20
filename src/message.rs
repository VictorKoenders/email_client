use failure::ResultExt;
use mailparse::{parse_mail, ParsedMail};
use std::collections::HashMap;
use Result;

#[derive(Clone, Debug, Serialize)]
pub struct Message {
    pub headers: HashMap<String, String>,
    pub from: Option<String>,
    pub to: Option<String>,
    pub subject: Option<String>,
    pub content: Vec<String>,
    pub raw: String,
}

impl Message {
    pub fn mock() -> Message {
        Message {
            headers: HashMap::new(),
            from: Some(String::from("test@trangar.com")),
            to: Some(String::from("butts@trangar.com")),
            subject: Some(String::from("This is a mock title")),
            content: vec![String::from("This is a mock message")],
            raw: String::new(),
        }
    }
    pub fn from(raw: &[u8]) -> Result<Message> {
        let parsed = parse_mail(raw)
            .with_context(|e| format!("Could not parse raw mail message: {}\n{:?}", e, raw))?;
        let raw_string = String::from_utf8_lossy(raw).into_owned();
        let mut message = Message {
            headers: HashMap::new(),
            from: None,
            to: None,
            subject: None,
            content: Vec::new(),
            raw: raw_string,
        };
        message
            .append(&parsed)
            .with_context(|e| format!("Could not convert mail message: {}\n{:?}", e, raw))?;
        Ok(message)
    }

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
    }
}
