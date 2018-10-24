use super::{Handler, MessageHandler};
use actix::{Actor, ActorFuture, ContextFutureSpawner, WrapFuture};
use crate::data::messages::{LoadAttachment, LoadAttachmentResponse};
use crate::web::socket::client::Client;
use crate::Result;
use shared::attachment::LoadAttachmentRequest;
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
            .then(super::map_result(|res: LoadAttachmentResponse| {
                ServerToClient::LoadAttachmentResponse(res.attachment.into())
            }))
            .wait(ctx);
        Ok(())
    }
}
