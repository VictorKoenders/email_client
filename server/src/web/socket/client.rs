use super::message::{Connect, Disconnect, EmailReceived};

use actix::{
    fut, Actor, ActorContext, ActorFuture, AsyncContext, ContextFutureSpawner, Handler, Running,
    StreamHandler, WrapFuture,
};
use actix_web::ws;
use data::NewEmail;
use serde::Serialize;
use serde_json;
use std::net::SocketAddr;
use std::str::FromStr;
use web::State as ServerState;
use Result;

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

pub trait Sender<T> {
    fn send_proto(&mut self, val: T) -> Result<()>;
}

/*
impl Sender<ServerToClient> for <Client as Actor>::Context {
    fn send_proto(&mut self, val: ServerToClient) -> Result<()> {
        let mut vec = Vec::new();
        val.write_to_vec(&mut vec)?;
        println!("Sending {} bytes:", vec.len());
        println!("{:?}", val);
        println!("{:?}", vec);
        self.binary(vec);
        Ok(())
    }
}

impl Sender<Error> for <Client as Actor>::Context {
    fn send_proto(&mut self, val: Error) -> Result<()> {
        let mut msg = ServerToClient::default();
        msg.set_error(val);
        self.send_proto(msg)
    }
}

impl Sender<AuthenticateResponse> for <Client as Actor>::Context {
    fn send_proto(&mut self, val: AuthenticateResponse) -> Result<()> {
        let mut msg = ServerToClient::default();
        msg.set_authenticate(val);
        self.send_proto(msg)
    }
}

impl Sender<LoadInboxResponse> for <Client as Actor>::Context {
    fn send_proto(&mut self, val: LoadInboxResponse) -> Result<()> {
        let mut msg = ServerToClient::default();
        msg.set_inbox(val);
        self.send_proto(msg)
    }
}
*/

pub trait ContextSender {
    #[deprecated(note = "Switch to protobuf")]
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
                if !text.is_empty() {
                    println!("Got TEXT from client, ignoring");
                    println!("{}", text);
                }
            }
            ws::Message::Binary(bin) => {
                println!("Received {:?} bytes", bin.len());
                /*let mut reader = ::std::io::Cursor::new(bin.take());
                let mut input = ::protobuf::CodedInputStream::new(&mut reader);
                use protobuf::Message;
                let mut result = ::proto::ClientToServer::new();
                match result.merge_from(&mut input) {
                    Ok(()) => {
                        println!("{:?}", result);
                        let message = match result.message {
                            Some(m) => m,
                            None => {
                                println!("Client did not send a valid message");
                                return;
                            }
                        };
                        let result = match message {
                            ::proto::ClientToServer_oneof_message::authenticate(auth) => {
                                MessageHandler.handle(self, ctx, auth)
                            }
                            ::proto::ClientToServer_oneof_message::load_inbox(load_inbox) => {
                                MessageHandler.handle(self, ctx, load_inbox)
                            }
                            ::proto::ClientToServer_oneof_message::load_email(load_email) => {
                                Err(format_err!("Got load_email: {:?}", load_email))
                            }
                            ::proto::ClientToServer_oneof_message::load_attachment(
                                load_attachment,
                            ) => Err(format_err!("Got load_attachment: {:?}", load_attachment)),
                        };
                        if let Err(e) = result {
                            let _ = ctx.send_proto({
                                let mut error = Error::default();
                                error.error = format!("{:?}", e);
                                error
                            });
                        }
                    }
                    Err(e) => println!("Could not receive binary blob from client: {:?}", e),
                }
                */
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
