/*
use super::{Handler, MessageHandler};
use actix::{fut, Actor, ActorContext, ActorFuture, ContextFutureSpawner, WrapFuture};
use data::messages::ListAddresses;
// use proto::authenticate::{AuthenticateRequest, AuthenticateResponse};
// use proto::inbox::InboxHeader;
use std::env;
use web::socket::client::{Client, Sender};
use Result;

impl MessageHandler<AuthenticateRequest> for Handler {
    fn handle(
        &self,
        client: &mut Client,
        ctx: &mut <Client as Actor>::Context,
        value: AuthenticateRequest,
    ) -> Result<()> {
        if value.username.is_empty() || value.password.is_empty() {
            return ctx.send_proto({
                let mut response = AuthenticateResponse::default();
                response.set_success(false);
                response
            });
        }

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
                            let _ = ctx.send_proto({
                                let mut response = AuthenticateResponse::default();
                                response.set_success(true);
                                response.set_inboxes(
                                    res.0
                                        .into_iter()
                                        .map(Into::into)
                                        .collect::<Vec<InboxHeader>>()
                                        .into(),
                                );
                                response
                            });
                        }
                        _ => ctx.stop(),
                    }
                    fut::ok(())
                }).wait(ctx);
        } else {
            ctx.send_proto({
                let mut response = AuthenticateResponse::default();
                response.set_success(false);
                response
            })?;
        }
        Ok(())
    }
}
*/
