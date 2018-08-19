use super::{Address, Email};
use actix::dev::{Message, MessageResponse, ResponseChannel};
use actix::Actor;

pub struct ListAddresses;

impl Message for ListAddresses {
    type Result = ListAddressResult;
}

#[derive(Debug)]
pub struct ListAddressResult(pub Vec<Address>);

impl<T> MessageResponse<T, ListAddresses> for ListAddressResult
where
    T: Actor,
{
    fn handle<R: ResponseChannel<ListAddresses>>(self, _ctx: &mut T::Context, tx: Option<R>) {
        if let Some(tx) = tx {
            tx.send(self);
        }
    }
}

pub struct LoadInbox(pub Address);

#[derive(Serialize)]
pub struct LoadInboxResponse {
    pub address: Address,
    pub emails: Vec<Email>,
}

impl Message for LoadInbox {
    type Result = LoadInboxResponse;
}
impl<T> MessageResponse<T, LoadInbox> for LoadInboxResponse
where
    T: Actor,
{
    fn handle<R: ResponseChannel<LoadInbox>>(self, _ctx: &mut T::Context, tx: Option<R>) {
        if let Some(tx) = tx {
            tx.send(self);
        }
    }
}
