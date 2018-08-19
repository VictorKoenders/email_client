use super::{Address, Email};
use actix::dev::Message;
use Result;

#[derive(Debug)]
pub struct ListAddresses;

impl Message for ListAddresses {
    type Result = Result<ListAddressResult>;
}

#[derive(Debug)]
pub struct ListAddressResult(pub Vec<Address>);

#[derive(Debug)]
pub struct LoadInbox(pub Address);

#[derive(Debug, Serialize)]
pub struct LoadInboxResponse {
    pub address: Address,
    pub emails: Vec<Email>,
}

impl Message for LoadInbox {
    type Result = Result<LoadInboxResponse>;
}
