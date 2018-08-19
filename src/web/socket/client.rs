use super::{Connect, Disconnect};
use actix::{
    fut, Actor, ActorContext, ActorFuture, AsyncContext, ContextFutureSpawner, Handler, Running,
    StreamHandler, WrapFuture,
};
use actix_web::ws;
use data::{Address, ListAddresses, LoadInbox, LoadInboxResponse};
use mail_reader::ImapMessage;
use serde_json::{self, Value};
use web::State as ServerState;

#[derive(Default)]
pub struct Client {
    id: usize,
    open_inbox: Option<String>,
}

impl Actor for Client {
    type Context = ws::WebsocketContext<Self, ServerState>;

    fn started(&mut self, ctx: &mut Self::Context) {
        let client_addr = ctx.address();
        ctx.state()
            .websocket_server
            .send(Connect { client_addr })
            .into_actor(self)
            .then(|res, act, ctx| {
                match res {
                    Ok(id) => act.id = id,
                    _ => ctx.stop(),
                }
                fut::ok(())
            }).wait(ctx);

        ctx.state()
            .database
            .send(ListAddresses)
            .into_actor(self)
            .then(|res, _act, ctx| {
                match res {
                    Ok(Ok(res)) => ctx.text(serde_json::to_string(&Init { init: res.0 }).unwrap()),
                    _ => ctx.stop(),
                }
                fut::ok(())
            }).wait(ctx);
    }
    fn stopping(&mut self, ctx: &mut Self::Context) -> Running {
        ctx.state()
            .websocket_server
            .do_send(Disconnect { id: self.id });
        ctx.stop();
        Running::Stop
    }
}

#[derive(Serialize)]
struct Init {
    pub init: Vec<Address>,
}

#[derive(Serialize)]
struct InboxLoaded {
    pub inbox_loaded: LoadInboxResponse,
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
                    let address: Address = match serde_json::from_value(Value::Object(d.clone())) {
                        Ok(a) => a,
                        Err(e) => {
                            println!("Could not parse json from client. {:?}", e);
                            return;
                        }
                    };
                    self.open_inbox = Some(address.mail_address.clone());
                    ctx.state()
                        .database
                        .send(LoadInbox(address))
                        .into_actor(self)
                        .then(|res, _act, ctx| {
                            match res {
                                Ok(Ok(res)) => {
                                    ctx.text(
                                        serde_json::to_string(&InboxLoaded { inbox_loaded: res })
                                            .unwrap(),
                                    );
                                }
                                _ => ctx.stop(),
                            }
                            fut::ok(())
                        }).wait(ctx);
                    return;
                }
                println!("Unknown json from websocket client {:?}", text);
            }
            ws::Message::Binary(_bin) => {
                println!("Unknown binary blob from client, ignoring");
            }
            ws::Message::Pong(_msg) => {}
            ws::Message::Close(msg) => {
                println!("Client closed: {:?}", msg);
                ctx.close(None);
            }
        }
    }
}

impl Handler<ImapMessage> for Client {
    type Result = ();
    fn handle(&mut self, msg: ImapMessage, context: &mut Self::Context) {
        match msg {
            ImapMessage::NewMessage(msg) => {
                if self.open_inbox == msg.to
                    || self.open_inbox.as_ref().map(|s| s.as_str()) == Some("*@trangar.com")
                {
                    // TODO: Check if any mailbox is listening to the incoming message
                    context.text(format!(
                        "{{\"email_received\":{}}}",
                        serde_json::to_string(&msg).unwrap()
                    ));
                }
            }
        }
    }
}
