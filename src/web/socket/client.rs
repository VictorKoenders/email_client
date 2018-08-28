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

impl Client {
    fn send_email_info(
        &self,
        context: &mut ws::WebsocketContext<Self, ServerState>,
        email_received: EmailInfo,
    ) {
        assert!(self.authenticated);
        context.text(serde_json::to_string(&EmailReceived { email_received }).unwrap());
    }
    fn send_email_loaded(
        &self,
        context: &mut ws::WebsocketContext<Self, ServerState>,
        email_loaded: Email,
    ) {
        assert!(self.authenticated);
        context.text(serde_json::to_string(&EmailLoaded { email_loaded }).unwrap());
    }
    fn send_inbox_loaded(
        &self,
        context: &mut ws::WebsocketContext<Self, ServerState>,
        inbox_loaded: LoadInboxResponse,
    ) {
        assert!(self.authenticated);
        context.text(serde_json::to_string(&InboxLoaded { inbox_loaded }).unwrap());
    }
    fn send_init(
        &self,
        context: &mut ws::WebsocketContext<Self, ServerState>,
        init: Vec<InboxWithAddress>,
    ) {
        assert!(self.authenticated);
        context.text(serde_json::to_string(&Init { init }).unwrap());
    }
    fn send_attachment(
        &self,
        context: &mut ws::WebsocketContext<Self, ServerState>,
        attachment_loaded: Attachment,
    ) {
        assert!(self.authenticated);
        context.text(serde_json::to_string(&AttachmentLoaded { attachment_loaded }).unwrap());
    }
}

impl Client {
    fn handle_load_email(&self, d: &Map, ctx: &mut <Self as Actor>::Context) {
        if !self.authenticated {
            ctx.text(String::from("{{\"error\":\"Not authenticated\"}}"));
            return;
        }
        let email_info: EmailInfo = match serde_json::from_value(Value::Object(d.clone())) {
            Ok(info) => info,
            Err(e) => {
                println!("Could not parse json from client. {:?}", e);
                return;
            }
        };
        ctx.state()
            .database
            .send(LoadEmail(email_info))
            .into_actor(self)
            .then(|res, act, ctx| {
                match res {
                    Ok(Ok(res)) => {
                        act.send_email_loaded(ctx, res.email);
                    }
                    _ => ctx.stop(),
                }
                fut::ok(())
            })
            .wait(ctx);
    }

    fn handle_load_attachment(&self, d: &Map, ctx: &mut <Self as Actor>::Context) {
        if !self.authenticated {
            ctx.text(String::from("{{\"error\":\"Not authenticated\"}}"));
            return;
        }
        let attachment_info: AttachmentInfo = match serde_json::from_value(Value::Object(d.clone()))
        {
            Ok(info) => info,
            Err(e) => {
                println!("Could not parse json from client. {:?}", e);
                return;
            }
        };
        ctx.state()
            .database
            .send(LoadAttachment(attachment_info))
            .into_actor(self)
            .then(|res, act, ctx| {
                match res {
                    Ok(Ok(res)) => {
                        act.send_attachment(ctx, res.attachment);
                    }
                    _ => ctx.stop(),
                }
                fut::ok(())
            })
            .wait(ctx);
    }

    fn handle_load_inbox(&self, d: &Map, ctx: &mut <Self as Actor>::Context) {
        if !self.authenticated {
            ctx.text(String::from("{{\"error\":\"Not authenticated\"}}"));
            return;
        }
        let address: InboxWithAddress = match serde_json::from_value(Value::Object(d.clone())) {
            Ok(a) => a,
            Err(e) => {
                println!("Could not parse json from client. {:?}", e);
                return;
            }
        };
        ctx.state()
            .database
            .send(LoadInbox(address))
            .into_actor(self)
            .then(|res, act, ctx| {
                match res {
                    Ok(Ok(res)) => {
                        act.send_inbox_loaded(ctx, res);
                    }
                    _ => ctx.stop(),
                }
                fut::ok(())
            })
            .wait(ctx);
    }

    fn handle_authenticate(&mut self, d: &Map, ctx: &mut <Self as Actor>::Context) {
        let (username, password) = match (&d["username"], &d["password"]) {
            (Value::String(u), Value::String(p)) => (u, p),
            _ => {
                ctx.text(String::from("{{\"authenticate_result\":\"false\"}}"));
                return;
            }
        };
        let env_username =
            env::var("CLIENT_USERNAME").expect("Global variable CLIENT_USERNAME not set");
        let env_password =
            env::var("CLIENT_PASSWORD").expect("Global variable CLIENT_PASSWORD not set");
        self.authenticated = &env_username == username && &env_password == password;
        ctx.text(format!(
            "{{\"authenticate_result\":{}}}",
            self.authenticated
        ));

        if self.authenticated {
            ctx.state()
                .database
                .send(ListAddresses)
                .into_actor(self)
                .then(|res, act, ctx| {
                    match res {
                        Ok(Ok(res)) => act.send_init(ctx, res.0),
                        _ => ctx.stop(),
                    }
                    fut::ok(())
                })
                .wait(ctx);
        }
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
                    self.handle_load_inbox(d, ctx);
                    return;
                }
                if let Value::Object(d) = &data["authenticate"] {
                    self.handle_authenticate(d, ctx);
                    return;
                }
                if let Value::Object(d) = &data["load_email"] {
                    self.handle_load_email(d, ctx);
                    return;
                }
                if let Value::Object(d) = &data["load_attachment"] {
                    self.handle_load_attachment(d, ctx);
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
            self.send_email_info(context, msg.0);
        }
    }
}
