use super::{
    executor::Executor, Email, ListAddressResult, ListAddresses, LoadInbox, LoadInboxResponse,
};
use actix::{Actor, ArbiterService, Context, Handler, Recipient, Supervised};
use mail_reader::ImapMessage;
use Result;

#[derive(Default)]
pub struct Database {
    executor: Executor,
    listeners: Vec<Recipient<NewEmail>>,
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
pub struct NewEmail(pub Email);

impl Actor for Database {
    type Context = Context<Self>;
}
impl Handler<ImapMessage> for Database {
    type Result = ();
    fn handle(&mut self, message: ImapMessage, _context: &mut Self::Context) {
        match message {
            ImapMessage::NewMessage(message) => {
                let email = self
                    .executor
                    .save(message)
                    .expect("[Database] Could not save email");
                for listener in &self.listeners {
                    listener
                        .do_send(NewEmail(email.clone()))
                        .expect("[Database] Could not send email to listener");
                }
            }
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
        let addresses = self.executor.load_addresses()?;
        Ok(ListAddressResult(addresses))
    }
}
impl Handler<LoadInbox> for Database {
    type Result = Result<LoadInboxResponse>;

    fn handle(&mut self, msg: LoadInbox, _ctx: &mut Self::Context) -> Result<LoadInboxResponse> {
        let address = match self.executor.load_address_by_id(&msg.0.id) {
            Ok(Some(a)) => a,
            Ok(None) => bail!("Inbox not found: {:?}", msg.0),
            Err(e) => return Err(e),
        };
        let emails = self.executor.load_emails_by_address(&address.id)?;
        Ok(LoadInboxResponse { address, emails })
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
