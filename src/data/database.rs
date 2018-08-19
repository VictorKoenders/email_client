use super::{executor::Executor, ListAddressResult, ListAddresses, LoadInbox, LoadInboxResponse};
use actix::{Actor, ArbiterService, Context, Handler, Supervised};
use mail_reader::ImapMessage;
use Result;

#[derive(Default)]
pub struct Database {
    executor: Executor,
}

impl Actor for Database {
    type Context = Context<Self>;
}
impl Handler<ImapMessage> for Database {
    type Result = ();
    fn handle(&mut self, _message: ImapMessage, _context: &mut Self::Context) {}
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
