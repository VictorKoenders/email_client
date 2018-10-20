use crate::attachment::AttachmentHeader;
use std::collections::HashMap;
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
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
    pub headers: HashMap<String, String>,
    pub attachments: Vec<AttachmentHeader>,
}
