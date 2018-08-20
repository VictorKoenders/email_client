use super::{Connect, Disconnect};
use actix::{
    fut, Actor, ActorContext, ActorFuture, AsyncContext, ContextFutureSpawner, Handler, Running,
    StreamHandler, WrapFuture,
};
use actix_web::ws;
use data::{Address, Email, ListAddresses, LoadInbox, LoadInboxResponse, NewEmail};
use serde_json::{self, Value};
use web::State as ServerState;

#[derive(Default)]
pub struct Client {
    id: usize,
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
            .then(|res, act, ctx| {
                match res {
                    Ok(Ok(res)) => act.send_init(ctx, res.0),
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

impl Client {
    fn send_new_email(
        &self,
        context: &mut ws::WebsocketContext<Self, ServerState>,
        email_received: Email,
    ) {
        context.text(serde_json::to_string(&EmailReceived { email_received }).unwrap());
    }
    fn send_inbox_loaded(
        &self,
        context: &mut ws::WebsocketContext<Self, ServerState>,
        inbox_loaded: LoadInboxResponse,
    ) {
        context.text(serde_json::to_string(&InboxLoaded { inbox_loaded }).unwrap());
    }
    fn send_init(&self, context: &mut ws::WebsocketContext<Self, ServerState>, init: Vec<Address>) {
        context.text(serde_json::to_string(&Init { init }).unwrap());
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

#[derive(Serialize)]
struct EmailReceived {
    pub email_received: Email,
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

impl Handler<NewEmail> for Client {
    type Result = ();
    fn handle(&mut self, msg: NewEmail, context: &mut Self::Context) {
        self.send_new_email(context, msg.0);
    }
}
