use crate::attachment::AttachmentHeader;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct EmailHeader {
    pub id: Uuid,
    pub inbox_id: Uuid,
    pub from: Option<String>,
    pub to: Option<String>,
    pub subject: Option<String>,
    pub read: bool,
}

impl PartialEq<EmailHeader> for EmailHeader {
    fn eq(&self, other: &EmailHeader) -> bool {
        self.id == other.id
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoadEmailRequest {
    pub id: Uuid,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Email {
    pub id: Uuid,
    pub inbox_id: Uuid,
    pub from: Option<String>,
    pub to: Option<String>,
    pub subject: Option<String>,
    pub read: bool,
    pub imap_index: i32,
    pub text_plain_body: Option<String>,
    pub html_body: Option<String>,
    pub headers: Vec<Header>,
    pub attachments: Vec<AttachmentHeader>,
}

impl PartialEq<Email> for Email {
    fn eq(&self, other: &Email) -> bool {
        self.id == other.id
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Header {
    pub key: String,
    pub value: String,
}
