use super::{Handler, MessageHandler};
use actix::{Actor, ActorFuture, ContextFutureSpawner, WrapFuture};
use crate::data::messages::LoadInbox;
use crate::web::socket::client::Client;
use crate::Result;
use shared::inbox::{LoadInboxRequest, LoadInboxResponse};
use shared::ServerToClient;

impl MessageHandler<LoadInboxRequest> for Handler {
    fn handle(
        &self,
        client: &mut Client,
        ctx: &mut <Client as Actor>::Context,
        value: LoadInboxRequest,
    ) -> Result<()> {
        if !client.authenticated {
            bail!("Not authenticated");
        }
        ctx.state()
            .database
            .send(LoadInbox(value.id))
            .into_actor(client)
            .then(super::map_result(|res: LoadInboxResponse| {
                ServerToClient::LoadInboxResponse(res.into())
            }))
            .wait(ctx);
        Ok(())
    }
}
