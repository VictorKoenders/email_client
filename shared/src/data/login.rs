use crate::inbox::InboxHeader;

#[derive(Serialize, Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub enum LoginResponse {
    Success { inboxes: Vec<InboxHeader> },
    LoginFailed,
}
