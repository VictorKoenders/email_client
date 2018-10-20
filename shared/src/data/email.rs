use crate::attachment::AttachmentHeader;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone)]
pub struct EmailHeader {
    pub id: Uuid,
    pub inbox_id: Uuid,
    pub from: String,
    pub to: String,
    pub subject: String,
    pub read: bool,
}

#[derive(Serialize, Deserialize)]
pub struct LoadEmailRequest {
    pub id: Uuid,
}

#[derive(Serialize, Deserialize)]
pub struct Email {
    pub id: Uuid,
    pub inbox_id: Uuid,
    pub from: String,
    pub to: String,
    pub subject: String,
    pub read: bool,
    pub imap_index: i32,
    pub text_plain_body: String,
    pub html_body: String,
    pub headers: Vec<Header>,
    pub attachments: Vec<AttachmentHeader>,
}

#[derive(Serialize, Deserialize)]
pub struct Header {
    pub key: String,
    pub value: String,
}
