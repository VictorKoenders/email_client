use super::message::{Connect, Disconnect};

use super::message::{Handler as MessageHandler, MessageHandler as _handler_impl};
use actix::{
    fut, Actor, ActorContext, ActorFuture, AsyncContext, ContextFutureSpawner, Handler, Running,
    StreamHandler, WrapFuture,
};
use actix_web::ws;
use bincode;
use crate::data::NewEmail;
use crate::web::State as ServerState;
use shared::{ClientToServer, ServerToClient};
use std::net::SocketAddr;
use std::str::FromStr;

#[derive(Default)]
pub struct Client {
    id: usize,
    pub version_matches: bool,
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
                        eprintln!("Could not parse x-real-ip {:?}: {:?}", s, e);
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

impl StreamHandler<ws::Message, ws::ProtocolError> for Client {
    fn handle(&mut self, msg: ws::Message, ctx: &mut Self::Context) {
        match msg {
            ws::Message::Ping(msg) => ctx.pong(&msg),
            ws::Message::Text(text) => {
                if !text.is_empty() {
                    println!("Got TEXT from client, ignoring");
                    println!("{}", text);
                }
            }
            ws::Message::Binary(bin) => {
                let message: ClientToServer = match bincode::deserialize(bin.as_ref()) {
                    Ok(v) => v,
                    Err(e) => {
                        println!("Could not receive binary blob from client: {:?}", e);
                        return;
                    }
                };
                let result = match message {
                    ClientToServer::Version(v) => {
                        println!("Client is version {:?}", v);
                        return;
                    }
                    ClientToServer::Authenticate(request) => {
                        MessageHandler.handle(self, ctx, *request)
                    }
                    ClientToServer::LoadInbox(request) => {
                        MessageHandler.handle(self, ctx, *request)
                    }
                    ClientToServer::LoadEmail(request) => {
                        MessageHandler.handle(self, ctx, *request)
                    }
                    ClientToServer::LoadAttachment(request) => {
                        MessageHandler.handle(self, ctx, *request)
                    }
                };
                if let Err(e) = result {
                    if let Ok(bytes) = ServerToClient::Error(format!("{:?}", e)).to_bytes() {
                        ctx.binary(bytes);
                    }
                }
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
    fn handle(&mut self, _msg: NewEmail, _context: &mut Self::Context) {
        if self.authenticated {
            // TODO: Implement
        }
    }
}
