use crate::Result;
use database::diesel::pg::PgConnection;
use database::email_part::EmailPartType;
use hashbrown::HashMap;

#[derive(Debug)]
pub struct Attachment {
    pub headers: HashMap<String, String>,
    pub r#type: EmailPartType,
    pub file_name: Option<String>,
    pub body: Vec<u8>,
}

impl Attachment {
    pub fn save(
        self,
        conn: &PgConnection,
        mail: &database::email::Email,
    ) -> Result<database::email_part::EmailPart> {
        let part = database::email_part::EmailPart::create(
            conn,
            &mail,
            self.r#type,
            self.file_name.as_ref().map(String::as_str),
            &self.body,
        )?;

        for (key, value) in self.headers {
            database::email_header::EmailHeader::create(conn, mail, Some(&part), &key, &value)?;
        }
        Ok(part)
    }
}
