use super::Client;
use actix::{fut, Actor, ActorContext, Addr, MailboxError};
use failure::{Error, Fail};
use shared::ServerToClient;
use std::net::SocketAddr;

mod authentication;
mod load_attachment;
mod load_email;
mod load_inbox;

fn try_send_error(e: impl Into<Error>, ctx: &mut <Client as Actor>::Context) {
    if let Ok(bytes) = ServerToClient::Error(format!("{:?}", e.into())).to_bytes() {
        ctx.binary(bytes);
    } else {
        ctx.stop();
    }
}

pub struct MappedResult<TItem> {
    convert: Box<Fn(TItem) -> ServerToClient>,
}

impl<TItem>
    FnOnce<(
        Result<Result<TItem, Error>, MailboxError>,
        &mut Client,
        &mut <Client as Actor>::Context,
    )> for MappedResult<TItem>
{
    type Output = fut::FutureResult<(), (), Client>;

    extern "rust-call" fn call_once(
        self,
        (res, _client, ctx): (
            Result<Result<TItem, Error>, MailboxError>,
            &mut Client,
            &mut <Client as Actor>::Context,
        ),
    ) -> Self::Output {
        match res {
            Ok(Ok(res)) => match self.convert.call((res,)).to_bytes() {
                Ok(b) => ctx.binary(b),
                Err(e) => try_send_error(e.context("Could not serialize result"), ctx),
            },
            Ok(Err(e)) => try_send_error(e.context("Internal server error"), ctx),
            Err(e) => try_send_error(e.context("Mailbox error"), ctx),
        }
        fut::ok(())
    }
}

pub fn map_result<TItem>(
    convert: impl Fn(TItem) -> ServerToClient + 'static,
) -> MappedResult<TItem> {
    MappedResult {
        convert: Box::new(convert),
    }
}

pub struct Handler;
pub trait MessageHandler<TMessage> {
    fn handle(
        &self,
        client: &mut Client,
        context: &mut <Client as Actor>::Context,
        value: TMessage,
    ) -> Result<(), Error>;
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
