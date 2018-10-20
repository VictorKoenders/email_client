use super::{Handler, MessageHandler};
use actix::{fut, Actor, ActorContext, ActorFuture, ContextFutureSpawner, WrapFuture};
use data::messages::LoadInbox;
use proto::inbox::{LoadInboxRequest, LoadInboxResponse};
use std::str::FromStr;
use uuid::Uuid;
use web::socket::client::{Client, Sender};
use Result;

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
        let uuid = Uuid::from_str(&value.id)?;
        ctx.state()
            .database
            .send(LoadInbox(uuid))
            .into_actor(client)
            .then(|res, _, ctx| {
                match res {
                    Ok(Ok(res)) => {
                        let response: LoadInboxResponse = res.into();
                        let _ = ctx.send_proto(response);
                    }
                    _ => ctx.stop(),
                }
                fut::ok(())
            }).wait(ctx);
        Ok(())
    }
}
