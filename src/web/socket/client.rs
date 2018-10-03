use super::{Connect, Disconnect};
use actix::{
    fut, Actor, ActorContext, ActorFuture, AsyncContext, ContextFutureSpawner, Handler, Running,
    StreamHandler, WrapFuture,
};
use actix_web::ws;
use data::models::email::{Email, EmailInfo};
use data::models::email_attachment::{Attachment, AttachmentInfo};
use data::models::inbox::InboxWithAddress;
use data::{ListAddresses, LoadAttachment, LoadEmail, LoadInbox, LoadInboxResponse, NewEmail};
use serde::Serialize;
use serde_json::{self, Value};
use std::env;
use std::net::SocketAddr;
use std::str::FromStr;
use web::State as ServerState;

type Map = ::serde_json::Map<String, Value>;

#[derive(Default)]
pub struct Client {
    id: usize,
    authenticated: bool,
}

trait RequestIp {
    fn get_ip(&self) -> SocketAddr;
}
impl RequestIp for ::actix_web::HttpRequest<ServerState> {
    fn get_ip(&self) -> SocketAddr {
        if let Some(ip) = self.headers().get("x-real-ip") {
            if let Ok(s) = ip.to_str() {
                match SocketAddr::from_str(s) {
                    Ok(s) => return s,
                    Err(e) => {
                        println!("Could not parse x-real-ip {:?}: {:?}", s, e);
                    }
                }
            }
        }
        self.peer_addr().unwrap_or_else(|| ([0, 0, 0, 0], 0).into())
    }
}

impl Actor for Client {
    type Context = ws::WebsocketContext<Self, ServerState>;

    fn started(&mut self, ctx: &mut Self::Context) {
        let remote_addr = ctx.request().get_ip();
        let client_addr = ctx.address();
        ctx.state()
            .websocket_server
            .send(Connect {
                client_addr,
                remote_addr,
            })
            .into_actor(self)
            .then(|res, act, ctx| {
                match res {
                    Ok(id) => act.id = id,
                    _ => ctx.stop(),
                }
                fut::ok(())
            })
            .wait(ctx);
    }
    fn stopping(&mut self, ctx: &mut Self::Context) -> Running {
        ctx.state()
            .websocket_server
            .do_send(Disconnect { id: self.id });
        ctx.stop();
        Running::Stop
    }
}

trait ContextSender {
    fn send(&mut self, msg: &impl Serialize);
}

impl ContextSender for <Client as Actor>::Context {
    fn send(&mut self, obj: &impl Serialize) {
        self.text(serde_json::to_string(obj).unwrap());
    }
}

#[derive(Serialize)]
struct Init {
    pub init: Vec<InboxWithAddress>,
}

#[derive(Serialize)]
struct InboxLoaded {
    pub inbox_loaded: LoadInboxResponse,
}

#[derive(Serialize)]
struct EmailLoaded {
    pub email_loaded: Email,
}

#[derive(Serialize)]
struct EmailReceived {
    pub email_received: EmailInfo,
}

#[derive(Serialize)]
struct AttachmentLoaded {
    pub attachment_loaded: Attachment,
}

impl StreamHandler<ws::Message, ws::ProtocolError> for Client {
    fn handle(&mut self, msg: ws::Message, ctx: &mut Self::Context) {
        match msg {
            ws::Message::Ping(msg) => ctx.pong(&msg),
            ws::Message::Text(text) => {
                let data: Value = match serde_json::from_str(&text) {
                    Ok(d) => d,
                    Err(e) => {
                        println!("Could not parse json from client. {:?}", e);
                        return;
                    }
                };
                if let Value::Object(d) = &data["load_inbox"] {
                    LoadInboxMessage.handle(self, ctx, d);
                    return;
                }
                if let Value::Object(d) = &data["authenticate"] {
                    AuthenticationMessage.handle(self, ctx, d);
                    return;
                }
                if let Value::Object(d) = &data["load_email"] {
                    LoadEmailMessage.handle(self, ctx, d);
                    return;
                }
                if let Value::Object(d) = &data["load_attachment"] {
                    LoadAttachmentMessage.handle(self, ctx, d);
                    return;
                }
                println!("Unknown json from websocket client {:?}", text);
            }
            ws::Message::Binary(_bin) => {
                println!("Unknown binary blob from client, ignoring");
            }
            ws::Message::Pong(_msg) => {}
            ws::Message::Close(_msg) => {
                ctx.close(None);
            }
        }
    }
}

impl Handler<NewEmail> for Client {
    type Result = ();
    fn handle(&mut self, msg: NewEmail, context: &mut Self::Context) {
        if self.authenticated {
            context.text(
                serde_json::to_string(&EmailReceived {
                    email_received: msg.0,
                })
                .unwrap(),
            );
        }
    }
}

trait ClientMessage {
    fn handle(&self, client: &mut Client, context: &mut <Client as Actor>::Context, value: &Map);
}

#[derive(Serialize)]
struct Error<'a> {
    error: &'a str,
}

struct LoadInboxMessage;

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

struct AuthenticationMessage;

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

struct LoadEmailMessage;

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

struct LoadAttachmentMessage;
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
            })
            .wait(ctx);
    }
}
