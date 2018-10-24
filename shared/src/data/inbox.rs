use super::email::EmailHeader;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct InboxHeader {
    pub id: Uuid,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoadInboxRequest {
    pub id: Uuid,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoadInboxResponse {
    pub inbox: InboxHeader,
    pub emails: Vec<EmailHeader>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Inbox {
    pub id: Uuid,
    pub name: String,
    pub addresses: Vec<String>,
    pub unread_count: usize,
}

impl PartialEq for Inbox {
    fn eq(&self, other: &Inbox) -> bool {
        self.id.eq(&other.id)
    }
}
