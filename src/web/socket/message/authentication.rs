use actix::{fut, Actor, ActorContext, ActorFuture, ContextFutureSpawner, WrapFuture};
use data::messages::ListAddresses;
use serde_json::Value;
use std::env;
use web::socket::client::{Client, ContextSender};
use web::socket::message::{ClientMessage, Init, Map};

pub struct AuthenticationMessage;

#[derive(Serialize)]
struct AuthenticateResult {
    authenticate_result: bool,
}

impl ClientMessage for AuthenticationMessage {
    fn handle(&self, client: &mut Client, ctx: &mut <Client as Actor>::Context, value: &Map) {
        let (username, password) = match (&value["username"], &value["password"]) {
            (Value::String(u), Value::String(p)) => (u, p),
            _ => {
                ctx.send(&AuthenticateResult {
                    authenticate_result: false,
                });
                return;
            }
        };
        let env_username =
            env::var("CLIENT_USERNAME").expect("Global variable CLIENT_USERNAME not set");
        let env_password =
            env::var("CLIENT_PASSWORD").expect("Global variable CLIENT_PASSWORD not set");
        client.authenticated = &env_username == username && &env_password == password;
        ctx.send(&AuthenticateResult {
            authenticate_result: client.authenticated,
        });

        if client.authenticated {
            ctx.state()
                .database
                .send(ListAddresses)
                .into_actor(client)
                .then(|res, _, ctx| {
                    match res {
                        Ok(Ok(res)) => {
                            ctx.send(&Init { init: res.0 });
                        }
                        _ => ctx.stop(),
                    }
                    fut::ok(())
                })
                .wait(ctx);
        }
    }
}
