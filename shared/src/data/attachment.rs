use std::collections::HashMap;
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct AttachmentHeader {
    pub id: Uuid,
    pub mime_type: String,
    pub name: String,
    pub content_id: String,
}

#[derive(Serialize, Deserialize)]
pub struct LoadAttachmentRequest {
    pub id: Uuid,
}

#[derive(Serialize, Deserialize)]
pub struct Attachment {
    pub id: Uuid,
    pub headers: HashMap<String, String>,
    pub mime_type: String,
    pub name: String,
    pub content_id: String,
    pub content: Vec<u8>,
}
