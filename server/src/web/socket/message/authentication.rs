use super::{Handler, MessageHandler};
use actix::{Actor, ActorFuture, ContextFutureSpawner, WrapFuture};
use crate::data::messages::ListAddresses;
use crate::web::socket::client::Client;
use crate::Result;
use shared::inbox::Inbox;
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
                .then(super::map_result(|inboxes: Vec<Inbox>| {
                    ServerToClient::LoginResponse(LoginResponse::Success { inboxes }.into())
                }))
                .wait(ctx);
        } else if let Ok(bytes) =
            ServerToClient::LoginResponse(LoginResponse::Failed.into()).to_bytes()
        {
            ctx.binary(bytes);
        }
        Ok(())
    }
}
