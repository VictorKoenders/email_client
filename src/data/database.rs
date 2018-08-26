use super::models::email::{Email, EmailFromImap, EmailInfo};
use super::models::inbox::InboxWithAddress;
use super::{
    ListAddressResult, ListAddresses, LoadEmail, LoadEmailResponse, LoadInbox, LoadInboxResponse,
};
use actix::{Actor, ArbiterService, Context, Handler, Recipient, Supervised};
use diesel::PgConnection;
use mail_reader::ImapMessage;
use r2d2::Pool;
use r2d2_diesel::ConnectionManager;
use std::env;
use Result;

pub struct Database {
    pool: Pool<ConnectionManager<PgConnection>>,
    listeners: Vec<Recipient<NewEmail>>,
}

impl Default for Database {
    fn default() -> Database {
        let url = env::var("DATABASE_URL").expect("Global variable DATABASE_URL not set");
        let manager = ConnectionManager::<PgConnection>::new(url);
        let pool = Pool::builder().build(manager).unwrap();
        Database {
            pool,
            listeners: Vec::new(),
        }
    }
}

#[derive(Message)]
pub struct AddNewEmailListener(pub Recipient<NewEmail>);

impl Handler<AddNewEmailListener> for Database {
    type Result = ();
    fn handle(&mut self, message: AddNewEmailListener, _context: &mut Self::Context) {
        self.listeners.push(message.0);
    }
}

#[derive(Message, Clone)]
pub struct NewEmail(pub EmailInfo);

impl Actor for Database {
    type Context = Context<Self>;
}
impl Handler<ImapMessage> for Database {
    type Result = ();
    fn handle(&mut self, message: ImapMessage, _context: &mut Self::Context) {
        let connection = self.pool.get().expect("Could not get connection");
        match message {
            ImapMessage::NewMessage(message) => match EmailFromImap::save(&connection, &message) {
                Ok(m) => {
                    for listener in &self.listeners {
                        listener
                            .do_send(NewEmail(m.clone()))
                            .expect("[Database] Could not send new email to listeners");
                    }
                }
                Err(e) => {
                    println!(
                        "Could not save email with IMAP_INDEX {}: {:?}",
                        message.imap_index, e
                    );
                    match EmailFromImap::save_empty(&connection, &message) {
                        Ok(_) => {}
                        Err(e) => {
                            eprintln!(
                                "Could not save email with IMAP_INDEX {}: {:?}",
                                message.imap_index, e
                            );
                        }
                    }
                }
            },
        }
    }
}

impl Handler<ListAddresses> for Database {
    type Result = Result<ListAddressResult>;
    fn handle(
        &mut self,
        _message: ListAddresses,
        _context: &mut Self::Context,
    ) -> Result<ListAddressResult> {
        let connection = self.pool.get()?;
        let addresses = InboxWithAddress::load(&connection)?;
        Ok(ListAddressResult(addresses))
    }
}
impl Handler<LoadEmail> for Database {
    type Result = Result<LoadEmailResponse>;

    fn handle(&mut self, msg: LoadEmail, _ctx: &mut Self::Context) -> Result<LoadEmailResponse> {
        let connection = self.pool.get()?;
        let email = Email::load_by_id(&connection, &msg.0.id)?;
        Ok(LoadEmailResponse { email })
    }
}
impl Handler<LoadInbox> for Database {
    type Result = Result<LoadInboxResponse>;

    fn handle(&mut self, msg: LoadInbox, _ctx: &mut Self::Context) -> Result<LoadInboxResponse> {
        let connection = self.pool.get()?;
        let inbox_with_address = InboxWithAddress::load_by_id(&connection, &msg.0.id)?;
        let emails = EmailInfo::load_by_inbox(&connection, &inbox_with_address.id)?;
        Ok(LoadInboxResponse {
            inbox_with_address,
            emails,
        })
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
