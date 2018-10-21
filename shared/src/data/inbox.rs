use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct InboxHeader {
    pub id: Uuid,
    pub name: String,
    pub unread_count: usize,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoadInboxRequest {
    pub id: Uuid,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Inbox {
    pub id: Uuid,
    pub name: String,
    pub addresses: Vec<String>,
    pub unread_count: usize,
}
