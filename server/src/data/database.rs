use super::messages::{
    AddNewEmailListener, ListAddresses, LoadAttachment, LoadEmail, LoadInbox, NewEmail,
};
use super::models::email::EmailFromImap;
use super::models::Loadable;
use actix::{Actor, ArbiterService, Context, Handler, Recipient, Supervised};
use crate::mail_reader::ImapMessage;
use crate::Result;
use diesel::PgConnection;
use r2d2::Pool;
use r2d2_diesel::ConnectionManager;
use shared::attachment::Attachment;
use shared::email::{Email, EmailHeader};
use shared::inbox::{Inbox, InboxHeader, LoadInboxResponse};
use std::env;

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

impl Actor for Database {
    type Context = Context<Self>;
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

impl Database {
    pub fn clear() {
        use super::schema::*;
        use diesel::RunQueryDsl;

        let database = Self::default();
        let connection = database.pool.get().unwrap();

        ::diesel::delete(email_attachment_header::table)
            .execute(&*connection)
            .expect("Could not clear table attachment_header");
        ::diesel::delete(email_attachment::table)
            .execute(&*connection)
            .expect("Could not clear table attachment");
        ::diesel::delete(email_header::table)
            .execute(&*connection)
            .expect("Could not clear table email_header");
        ::diesel::delete(email::table)
            .execute(&*connection)
            .expect("Could not clear table email");
        println!("[Database] Cleared");
    }
}

impl Handler<AddNewEmailListener> for Database {
    type Result = ();
    fn handle(&mut self, message: AddNewEmailListener, _context: &mut Self::Context) {
        self.listeners.push(message.0);
    }
}

impl Handler<ImapMessage> for Database {
    type Result = ();
    fn handle(&mut self, message: ImapMessage, _context: &mut Self::Context) {
        let connection = self.pool.get().expect("Could not get connection");
        match message {
            ImapMessage::NewMessage(message) => {
                print!("[Database] Saving Imap ID {}", message.imap_index);
                match EmailFromImap::save(&connection, &message) {
                    Ok(m) => {
                        println!(" as email ID {}", m.id);
                        for listener in &self.listeners {
                            listener
                                .do_send(NewEmail(m.clone()))
                                .expect("[Database] Could not send new email to listeners");
                        }
                    }
                    Err(e) => {
                        println!(", failed: {:?}", e);
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
                }
            }
        }
    }
}

impl Handler<ListAddresses> for Database {
    type Result = Result<Vec<Inbox>>;
    fn handle(
        &mut self,
        _message: ListAddresses,
        _context: &mut Self::Context,
    ) -> Result<Vec<Inbox>> {
        let connection = self.pool.get()?;
        let addresses = Vec::<Inbox>::load(&connection, ())?;
        Ok(addresses)
    }
}
impl Handler<LoadEmail> for Database {
    type Result = Result<Email>;

    fn handle(&mut self, msg: LoadEmail, _ctx: &mut Self::Context) -> Result<Email> {
        let connection = self.pool.get()?;
        let email = Email::load(&connection, msg.0)?;
        Ok(email)
    }
}
impl Handler<LoadInbox> for Database {
    type Result = Result<LoadInboxResponse>;

    fn handle(&mut self, msg: LoadInbox, _ctx: &mut Self::Context) -> Result<LoadInboxResponse> {
        let connection = self.pool.get()?;
        let inbox: Option<InboxHeader> = Loadable::load(&connection, msg.0)?;
        let inbox = match inbox {
            Some(i) => i,
            None => bail!("Inbox not found"),
        };
        let emails: Vec<EmailHeader> = Loadable::load(&connection, inbox.id)?;
        Ok(LoadInboxResponse { inbox, emails })
    }
}

impl Handler<LoadAttachment> for Database {
    type Result = Result<Attachment>;

    fn handle(&mut self, msg: LoadAttachment, _ctx: &mut Self::Context) -> Result<Attachment> {
        let connection = self.pool.get()?;
        let attachment = Attachment::load(&connection, msg.0)?;
        Ok(attachment)
    }
}
