use bincode;
use crate::attachment::LoadAttachmentRequest;
use crate::email::LoadEmailRequest;
use crate::inbox::LoadInboxRequest;
use crate::login::LoginRequest;
use failure::{Error, ResultExt};
use std::io::Write;

pub const CLIENT_TO_SERVER_VERSION: ClientToServer = ClientToServer::Version(1);

#[derive(Debug, Serialize, Deserialize)]
pub enum ClientToServer {
    Version(u32),
    Authenticate(Box<LoginRequest>),
    LoadInbox(Box<LoadInboxRequest>),
    LoadEmail(Box<LoadEmailRequest>),
    LoadAttachment(Box<LoadAttachmentRequest>),
}

impl ClientToServer {
    pub fn to_bytes(&self) -> Result<Vec<u8>, Error> {
        let mut bytes = Vec::new();
        self.to_writer(&mut bytes)?;
        Ok(bytes)
    }

    pub fn to_writer(&self, writer: &mut impl Write) -> Result<(), Error> {
        bincode::serialize_into(writer, self)
            .context("Could not serialize ClientToServer")
            .map_err(Into::into)
    }

    pub fn from_bytes(bytes: &[u8]) -> Result<Self, Error> {
        bincode::deserialize_from(bytes)
            .context("Could not deserialize ClientToServer")
            .map_err(Into::into)
    }
}
