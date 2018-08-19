use super::{Address, Email, ListAddressResult, ListAddresses, LoadInbox, LoadInboxResponse};
use actix::{Actor, ArbiterService, Context, Handler, Supervised};
use mail_reader::ImapMessage;
use uuid::Uuid;

#[derive(Default)]
pub struct Database {}

impl Actor for Database {
    type Context = Context<Self>;
}
impl Handler<ImapMessage> for Database {
    type Result = ();
    fn handle(&mut self, _message: ImapMessage, _context: &mut Self::Context) {}
}

impl Handler<ListAddresses> for Database {
    type Result = ListAddressResult;
    fn handle(
        &mut self,
        _message: ListAddresses,
        _context: &mut Self::Context,
    ) -> ListAddressResult {
        ListAddressResult(vec![
            Address {
                id: Uuid::nil(),
                short_name: String::from("Catch-all"),
                mail_address: String::from("*@trangar.com"),
                unseen_count: 1,
            },
            Address {
                id: Uuid::nil(),
                short_name: String::from("LinkedIn"),
                mail_address: String::from("linkedin@trangar.com"),
                unseen_count: 0,
            },
            Address {
                id: Uuid::nil(),
                short_name: String::from("Twitter"),
                mail_address: String::from("twitter@trangar.com"),
                unseen_count: 0,
            },
        ])
    }
}
impl Handler<LoadInbox> for Database {
    type Result = LoadInboxResponse;

    fn handle(&mut self, msg: LoadInbox, _ctx: &mut Self::Context) -> LoadInboxResponse {
        let emails = match msg.0.mail_address.as_str() {
            "*@trangar.com" => vec![Email {
                from: String::from("victor.koenders@gmail.com"),
                to: String::from("butts@trangar.com"),
                subject: String::from("Hahaha butts"),
                body: String::from("I'm so funny"),
                seen: false,
            }],
            "linkedin@trangar.com" => vec![Email {
                from: String::from("no-reply@linkedin.com"),
                to: String::from("linkedin@trangar.com"),
                subject: String::from("Spam from linkedin"),
                body: String::from("This is spam"),
                seen: true,
            }],
            _ => Vec::new(),
        };
        LoadInboxResponse {
            address: msg.0,
            emails,
        }
    }
}

impl Supervised for Database {
    fn restarting(&mut self, _ctx: &mut Self::Context) {
        println!("[Database] Restarting");
    }
}

impl ArbiterService for Database {
    fn service_started(&mut self, _ctx: &mut Context<Self>) {
        println!("[Database] Started");
    }
}
