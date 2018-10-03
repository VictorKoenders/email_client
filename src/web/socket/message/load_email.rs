use actix::{fut, Actor, ActorContext, ActorFuture, ContextFutureSpawner, WrapFuture};
use data::messages::LoadEmail;
use data::models::email::EmailInfo;
use serde_json::Value;
use web::socket::client::{Client, ContextSender};
use web::socket::message::{ClientMessage, EmailLoaded, Error, Map};

pub struct LoadEmailMessage;

impl ClientMessage for LoadEmailMessage {
    fn handle(&self, client: &mut Client, ctx: &mut <Client as Actor>::Context, value: &Map) {
        if !client.authenticated {
            ctx.send(&Error {
                error: "Not authenticated",
            });
            return;
        }
        let email_info: EmailInfo = match serde_json::from_value(Value::Object(value.clone())) {
            Ok(info) => info,
            Err(e) => {
                println!("Could not parse json from client. {:?}", e);
                return;
            }
        };
        ctx.state()
            .database
            .send(LoadEmail(email_info))
            .into_actor(client)
            .then(|res, _, ctx| {
                match res {
                    Ok(Ok(res)) => {
                        ctx.send(&EmailLoaded {
                            email_loaded: res.email,
                        });
                    }
                    _ => ctx.stop(),
                }
                fut::ok(())
            })
            .wait(ctx);
    }
}
