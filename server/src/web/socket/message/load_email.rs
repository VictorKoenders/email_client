use super::{Handler, MessageHandler};
use actix::{Actor, ActorFuture, ContextFutureSpawner, WrapFuture};
use crate::data::messages::LoadEmail;
use crate::web::socket::client::Client;
use crate::Result;
use shared::email::{Email, LoadEmailRequest};
use shared::ServerToClient;

impl MessageHandler<LoadEmailRequest> for Handler {
    fn handle(
        &self,
        client: &mut Client,
        ctx: &mut <Client as Actor>::Context,
        value: LoadEmailRequest,
    ) -> Result<()> {
        if !client.authenticated {
            bail!("Not authenticated");
        }
        ctx.state()
            .database
            .send(LoadEmail(value.id))
            .into_actor(client)
            .then(super::map_result(|res: Email| {
                ServerToClient::LoadEmailResponse(res.into())
            }))
            .wait(ctx);
        Ok(())
    }
}
