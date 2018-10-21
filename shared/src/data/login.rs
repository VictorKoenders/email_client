use crate::inbox::InboxHeader;

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum LoginResponse {
    Success { inboxes: Vec<InboxHeader> },
    LoginFailed,
}
