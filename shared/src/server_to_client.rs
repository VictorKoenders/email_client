use bincode;
use crate::attachment::Attachment;
use crate::email::Email;
use crate::inbox::Inbox;
use crate::login::LoginResponse;
use failure::{Error, ResultExt};
use std::io::Write;

pub const SERVER_TO_CLIENT_VERSION: ServerToClient = ServerToClient::Version(1);

#[derive(Debug, Serialize, Deserialize)]
pub enum ServerToClient {
    Version(u32),
    Error(String),
    LoginResponse(Box<LoginResponse>),
    LoadInboxResponse(Box<Inbox>),
    LoadEmailResponse(Box<Email>),
    LoadAttachmentResponse(Box<Attachment>),
    NewEmail(Box<Email>),
}

impl ServerToClient {
    pub fn to_bytes(&self) -> Result<Vec<u8>, Error> {
        let mut bytes = Vec::new();
        self.to_writer(&mut bytes)?;
        Ok(bytes)
    }

    pub fn to_writer(&self, writer: &mut impl Write) -> Result<(), Error> {
        bincode::serialize_into(writer, self)
            .context("Could not serialize ServerToClient")
            .map_err(Into::into)
    }

    pub fn from_bytes(bytes: &[u8]) -> Result<Self, Error> {
        bincode::deserialize_from(bytes)
            .context("Could not deserialize ServerToClient")
            .map_err(Into::into)
    }
}
