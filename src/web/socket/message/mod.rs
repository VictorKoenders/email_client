use super::Client;
use actix::{Actor, Addr};
use data::models::email::{Email, EmailInfo};
use data::models::email_attachment::Attachment;
use data::models::inbox::InboxWithAddress;
use data::LoadInboxResponse;
use std::net::SocketAddr;
use Result;

use proto::authenticate::AuthenticateRequest;

// mod authentication;
// mod load_attachment;
// mod load_email;
// mod load_inbox;

pub type Map = ::serde_json::Map<String, ::serde_json::Value>;
// pub use self::authentication::AuthenticationMessage;
// pub use self::load_attachment::LoadAttachmentMessage;
// pub use self::load_email::LoadEmailMessage;
// pub use self::load_inbox::LoadInboxMessage;

pub struct Handler;

pub trait MessageHandler<TMessage> {
    fn handle(&self, client: &mut Client, context: &mut <Client as Actor>::Context, value: TMessage) -> Result<()>;
}

impl MessageHandler<AuthenticateRequest> for Handler {
    fn handle(&self, _client: &mut Client, _context: &mut <Client as Actor>::Context, value: AuthenticateRequest) -> Result<()> {
        println!("Got authenticate: {:?}", value);
        Ok(())
    }
}

pub trait ClientMessage {
    fn handle(&self, client: &mut Client, context: &mut <Client as Actor>::Context, value: &Map);
}

#[derive(Message)]
#[rtype(usize)]
pub struct Connect {
    pub client_addr: Addr<Client>,
    pub remote_addr: SocketAddr,
}

#[derive(Message)]
pub struct Disconnect {
    pub id: usize,
}

#[derive(Serialize)]
pub struct Error<'a> {
    error: &'a str,
}

#[derive(Serialize)]
pub struct Init {
    pub init: Vec<InboxWithAddress>,
}

#[derive(Serialize)]
pub struct InboxLoaded {
    pub inbox_loaded: LoadInboxResponse,
}

#[derive(Serialize)]
pub struct EmailLoaded {
    pub email_loaded: Email,
}

#[derive(Serialize)]
pub struct EmailReceived {
    pub email_received: EmailInfo,
}

#[derive(Serialize)]
pub struct AttachmentLoaded {
    pub attachment_loaded: Attachment,
}

