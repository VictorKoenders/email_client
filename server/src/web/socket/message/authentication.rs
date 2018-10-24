use super::{Handler, MessageHandler};
use actix::{fut, Actor, ActorContext, ActorFuture, ContextFutureSpawner, WrapFuture};
use crate::data::messages::ListAddresses;
use crate::web::socket::client::Client;
use crate::Result;
use shared::login::{LoginRequest, LoginResponse};
use shared::ServerToClient;
use std::env;

impl MessageHandler<LoginRequest> for Handler {
    fn handle(
        &self,
        client: &mut Client,
        ctx: &mut <Client as Actor>::Context,
        value: LoginRequest,
    ) -> Result<()> {
        let env_username =
            env::var("CLIENT_USERNAME").expect("Global variable CLIENT_USERNAME not set");
        let env_password =
            env::var("CLIENT_PASSWORD").expect("Global variable CLIENT_PASSWORD not set");

        client.authenticated = env_username == value.username && env_password == value.password;

        if client.authenticated {
            ctx.state()
                .database
                .send(ListAddresses)
                .into_actor(client)
                .then(|res, _, ctx| {
                    match res {
                        Ok(Ok(res)) => {
                            if let Ok(bytes) = ServerToClient::LoginResponse(
                                LoginResponse::Success { inboxes: res.0 }.into(),
                            )
                            .to_bytes()
                            {
                                ctx.binary(bytes);
                            }
                        }
                        _ => ctx.stop(),
                    }
                    fut::ok(())
                })
                .wait(ctx);
        } else if let Ok(bytes) =
            ServerToClient::LoginResponse(LoginResponse::Failed.into()).to_bytes()
        {
            ctx.binary(bytes);
        }
        Ok(())
    }
}
