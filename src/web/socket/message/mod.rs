use data::models::email::{Email, EmailInfo};
use data::models::email_attachment::Attachment;
use data::models::inbox::InboxWithAddress;
use data::LoadInboxResponse;
use std::net::SocketAddr;
use Result;
use actix::{fut, Addr, Actor, ActorFuture, WrapFuture, ActorContext, ContextFutureSpawner};
use data::messages::ListAddresses;
use std::env;
use web::socket::client::Client;
use proto::authenticate::{AuthenticateRequest, AuthenticateResponse};

// mod authentication;
// mod load_attachment;
// mod load_email;
// mod load_inbox;

pub type Map = ::serde_json::Map<String, ::serde_json::Value>;
// pub use self::authentication::AuthenticationMessage;
// pub use self::load_attachment::LoadAttachmentMessage;
// pub use self::load_email::LoadEmailMessage;
// pub use self::load_inbox::LoadInboxMessage;

trait Sender<T> {
    fn send_proto(&mut self, val: T) -> Result<()>;
}

impl Sender<AuthenticateResponse> for <Client as Actor>::Context {
    fn send_proto(&mut self, val: AuthenticateResponse) -> Result<()> {
        println!("Sending {:?}", val);
        Ok(())
    }
}

pub struct Handler;

pub trait MessageHandler<TMessage> {
    fn handle(&self, client: &mut Client, context: &mut <Client as Actor>::Context, value: TMessage) -> Result<()>;
}

impl MessageHandler<AuthenticateRequest> for Handler {
    fn handle(&self, client: &mut Client, ctx: &mut <Client as Actor>::Context, value: AuthenticateRequest) -> Result<()> {
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

        ctx.send_proto({
            let mut response = AuthenticateResponse::default();
            response.set_success(client.authenticated);
            response
        })?;
        if client.authenticated {
            ctx.state()
                .database
                .send(ListAddresses)
                .into_actor(client)
                .then(|res, _, ctx| {
                    match res {
                        Ok(Ok(res)) => {
                            println!("Got {:?}", res.0);
                            // ctx.send(&Init { init: res.0 });
                        }
                        _ => ctx.stop(),
                    }
                    fut::ok(())
                })
                .wait(ctx);
 
        }
        Ok(())
    }
}

pub trait ClientMessage {
    fn handle(&self, client: &mut Client, context: &mut <Client as Actor>::Context, value: &Map);
}

#[derive(Message)]
#[rtype(usize)]
pub struct Connect {
    pub client_addr: Addr<Client>,
    pub remote_addr: SocketAddr,
}

#[derive(Message)]
pub struct Disconnect {
    pub id: usize,
}

#[derive(Serialize)]
pub struct Error<'a> {
    error: &'a str,
}

#[derive(Serialize)]
pub struct Init {
    pub init: Vec<InboxWithAddress>,
}

#[derive(Serialize)]
pub struct InboxLoaded {
    pub inbox_loaded: LoadInboxResponse,
}

#[derive(Serialize)]
pub struct EmailLoaded {
    pub email_loaded: Email,
}

#[derive(Serialize)]
pub struct EmailReceived {
    pub email_received: EmailInfo,
}

#[derive(Serialize)]
pub struct AttachmentLoaded {
    pub attachment_loaded: Attachment,
}

