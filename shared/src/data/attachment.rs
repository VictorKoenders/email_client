use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct AttachmentHeader {
    pub id: Uuid,
    pub mime_type: String,
    pub name: Option<String>,
    pub content_id: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct LoadAttachmentRequest {
    pub id: Uuid,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Attachment {
    pub id: Uuid,
    pub headers: Vec<Header>,
    pub mime_type: String,
    pub name: Option<String>,
    pub content_id: Option<String>,
    pub contents: Vec<u8>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Header {
    pub key: String,
    pub value: String,
}
