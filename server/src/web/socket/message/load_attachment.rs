use super::{Handler, MessageHandler};
use actix::{Actor, ActorFuture, ContextFutureSpawner, WrapFuture};
use crate::data::messages::LoadAttachment;
use crate::web::socket::client::Client;
use crate::Result;
use shared::attachment::{Attachment, LoadAttachmentRequest};
use shared::ServerToClient;

impl MessageHandler<LoadAttachmentRequest> for Handler {
    fn handle(
        &self,
        client: &mut Client,
        ctx: &mut <Client as Actor>::Context,
        value: LoadAttachmentRequest,
    ) -> Result<()> {
        if !client.authenticated {
            bail!("Not authenticated");
        }
        ctx.state()
            .database
            .send(LoadAttachment(value.id))
            .into_actor(client)
            .then(super::map_result(|res: Attachment| {
                ServerToClient::LoadAttachmentResponse(res.into())
            }))
            .wait(ctx);
        Ok(())
    }
}
