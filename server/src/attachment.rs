use crate::Result;
use mailparse::ParsedMail;
use std::collections::HashMap;

#[derive(Clone, Debug, Serialize, Default)]
pub struct Attachment {
    pub headers: HashMap<String, String>,
    pub mime_type: String,
    pub name: Option<String>,
    pub content_id: Option<String>,
    pub contents: Vec<u8>,
}

impl Attachment {
    pub fn from_parsed_mail(mail: &ParsedMail) -> Result<Attachment> {
        let headers = {
            let mut hashmap = HashMap::new();
            for header in &mail.headers {
                let key = header
                    .get_key()
                    .map_err(|e| format_err!("Could not parse attachment header key: {:?}", e))?;
                let value = header
                    .get_value()
                    .map_err(|e| format_err!("Could not parse attachment header key: {:?}", e))?;
                hashmap.insert(key, value);
            }
            hashmap
        };
        let mime_type = mail.ctype.mimetype.clone();
        let name = mail.ctype.params.get("name").cloned();
        let content_id = headers.get("Content-ID").cloned();
        let contents = mail
            .get_body_raw()
            .map_err(|e| format_err!("Could not parse attachment body: {:?}", e))?;
        Ok(Attachment {
            headers,
            mime_type,
            name,
            content_id,
            contents,
        })
    }
}
