use crate::email::EmailHeader;
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct InboxHeader {
    pub id: Uuid,
    pub name: String,
    pub unread_count: usize,
}

#[derive(Serialize, Deserialize)]
pub struct LoadInboxRequest {
    pub id: Uuid,
}

#[derive(Serialize, Deserialize)]
pub struct Inbox {
    pub id: Uuid,
    pub name: String,
    pub addresses: Vec<String>,
    pub unread_count: usize,
    pub email_headers: Vec<EmailHeader>,
}
