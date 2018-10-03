use super::message::{
    AuthenticationMessage, ClientMessage, Connect, Disconnect, EmailReceived,
    LoadAttachmentMessage, LoadEmailMessage, LoadInboxMessage,
};
use actix::{
    fut, Actor, ActorContext, ActorFuture, AsyncContext, ContextFutureSpawner, Handler, Running,
    StreamHandler, WrapFuture,
};
use actix_web::ws;
use data::NewEmail;
use serde::Serialize;
use serde_json::{self, Value};
use std::net::SocketAddr;
use std::str::FromStr;
use web::State as ServerState;

#[derive(Default)]
pub struct Client {
    id: usize,
    pub authenticated: bool,
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

pub trait ContextSender {
    fn send(&mut self, msg: &impl Serialize);
}

impl ContextSender for <Client as Actor>::Context {
    fn send(&mut self, obj: &impl Serialize) {
        self.text(serde_json::to_string(obj).unwrap());
    }
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
