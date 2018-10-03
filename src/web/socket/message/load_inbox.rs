use actix::{fut, Actor, ActorContext, ActorFuture, ContextFutureSpawner, WrapFuture};
use data::messages::LoadInbox;
use data::models::inbox::InboxWithAddress;
use serde_json::Value;
use web::socket::client::{Client, ContextSender};
use web::socket::message::{ClientMessage, Error, InboxLoaded, Map};

pub struct LoadInboxMessage;

impl ClientMessage for LoadInboxMessage {
    fn handle(&self, client: &mut Client, ctx: &mut <Client as Actor>::Context, value: &Map) {
        if !client.authenticated {
            ctx.send(&Error {
                error: "Not authenticated",
            });
            return;
        }
        let address: InboxWithAddress = match serde_json::from_value(Value::Object(value.clone())) {
            Ok(a) => a,
            Err(e) => {
                println!("Could not parse json from client. {:?}", e);
                return;
            }
        };
        ctx.state()
            .database
            .send(LoadInbox(address))
            .into_actor(client)
            .then(|res, _, ctx| {
                match res {
                    Ok(Ok(res)) => {
                        ctx.send(&InboxLoaded { inbox_loaded: res });
                    }
                    _ => ctx.stop(),
                }
                fut::ok(())
            })
            .wait(ctx);
    }
}
