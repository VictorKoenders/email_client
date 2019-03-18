use super::Attachment;
use crate::Result;
use database::diesel::pg::PgConnection;
use hashbrown::HashMap;

#[derive(Debug)]
pub struct Mail {
    pub imap_index: u64,
    pub headers: HashMap<String, String>,
    pub body_text: Option<Attachment>,
    pub body_html: Option<Attachment>,
    pub attachments: Vec<Attachment>,
}

impl Mail {
    pub fn new(imap_index: u64) -> Mail {
        Mail {
            imap_index,
            headers: HashMap::new(),
            body_text: None,
            body_html: None,
            attachments: Vec::new(),
        }
    }

    pub fn save(self, conn: &PgConnection) -> Result<()> {
        let mut mail = database::email::Email::create(conn, self.imap_index as i64)?;
        if let Some(text) = self.body_text {
            let part = text.save(conn, &mail)?;
            mail.body_text_id = Some(part.id);
        }
        if let Some(html) = self.body_html {
            let part = html.save(conn, &mail)?;
            mail.body_html_id = Some(part.id);
        }
        for attachment in self.attachments {
            attachment.save(conn, &mail)?;
        }
        for (key, value) in self.headers {
            database::email_header::EmailHeader::create(conn, &mail, None, &key, &value)?;
        }
        mail.save(conn)?;
        Ok(())
    }
}
