use actix::{fut, Actor, ActorContext, ActorFuture, ContextFutureSpawner, WrapFuture};
use data::messages::LoadAttachment;
use data::models::email_attachment::AttachmentInfo;
use serde_json::Value;
use web::socket::client::{Client, ContextSender};
use web::socket::message::{AttachmentLoaded, ClientMessage, Error, Map};

pub struct LoadAttachmentMessage;
impl ClientMessage for LoadAttachmentMessage {
    fn handle(&self, client: &mut Client, ctx: &mut <Client as Actor>::Context, value: &Map) {
        if !client.authenticated {
            ctx.send(&Error {
                error: "Not authenticated",
            });
            return;
        }
        let attachment_info: AttachmentInfo =
            match serde_json::from_value(Value::Object(value.clone())) {
                Ok(info) => info,
                Err(e) => {
                    println!("Could not parse json from client. {:?}", e);
                    return;
                }
            };
        ctx.state()
            .database
            .send(LoadAttachment(attachment_info))
            .into_actor(client)
            .then(|res, _, ctx| {
                match res {
                    Ok(Ok(res)) => {
                        ctx.send(&AttachmentLoaded {
                            attachment_loaded: res.attachment,
                        });
                    }
                    _ => ctx.stop(),
                }
                fut::ok(())
            }).wait(ctx);
    }
}
