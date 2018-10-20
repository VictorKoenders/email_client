use bincode;
use crate::LoginResponse;
use failure::{Error, ResultExt};
use std::io::Write;

pub const SERVER_TO_CLIENT_VERSION: ServerToClient = ServerToClient::Version(1);

#[derive(Serialize, Deserialize)]
pub enum ServerToClient {
    Version(u32),
    LoginResponse(LoginResponse),
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
