use super::Client;
use actix::{Actor, Addr};
use crate::Result;
use std::net::SocketAddr;

mod authentication;
// mod load_attachment;
// mod load_email;
mod load_inbox;

pub type Map = ::serde_json::Map<String, ::serde_json::Value>;
// pub use self::authentication::AuthenticationMessage;
// pub use self::load_attachment::LoadAttachmentMessage;
// pub use self::load_email::LoadEmailMessage;
// pub use self::load_inbox::LoadInboxMessage;
pub struct Handler;

pub trait MessageHandler<TMessage> {
    fn handle(
        &self,
        client: &mut Client,
        context: &mut <Client as Actor>::Context,
        value: TMessage,
    ) -> Result<()>;
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
