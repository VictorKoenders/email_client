use super::{Client, Connect, Disconnect};
use actix::{Actor, Addr, ArbiterService, Context, Handler, Supervised};
use mail_reader::ImapMessage;
use std::collections::HashMap;

#[derive(Default)]
pub struct Server {
    next_id: usize,
    clients: HashMap<usize, Addr<Client>>,
}

impl Actor for Server {
    type Context = Context<Self>;
}

impl Supervised for Server {
    fn restarting(&mut self, _ctx: &mut Self::Context) {
        println!("[WebsocketServer] Restarting");
    }
}

impl ArbiterService for Server {
    fn service_started(&mut self, _ctx: &mut Context<Self>) {
        println!("[WebsocketServer] Started");
        self.next_id = 1;
    }
}

impl Handler<Connect> for Server {
    type Result = usize;
    fn handle(&mut self, msg: Connect, _ctx: &mut Context<Self>) -> usize {
        let id = self.next_id;
        self.clients.insert(id, msg.client_addr);
        println!("Accepting incoming client {}", id);
        self.next_id += 1;
        id
    }
}

impl Handler<Disconnect> for Server {
    type Result = ();
    fn handle(&mut self, msg: Disconnect, _ctx: &mut Context<Self>) -> () {
        println!("Dropping client {}", msg.id);
        self.clients.remove(&msg.id);
    }
}

impl Handler<ImapMessage> for Server {
    type Result = ();
    fn handle(&mut self, _msg: ImapMessage, _ctx: &mut Context<Self>) -> () {}
}
