use actix::dev::Message;
use actix::Recipient;
use crate::Result;
use shared::attachment::Attachment;
use shared::email::{Email, EmailHeader};
use shared::inbox::{Inbox, LoadInboxResponse};
use uuid::Uuid;

#[derive(Message)]
pub struct AddNewEmailListener(pub Recipient<NewEmail>);

#[derive(Message, Clone)]
pub struct NewEmail(pub EmailHeader);

#[derive(Debug)]
pub struct ListAddresses;

impl Message for ListAddresses {
    type Result = Result<Vec<Inbox>>;
}

#[derive(Debug)]
pub struct LoadInbox(pub Uuid);

impl Message for LoadInbox {
    type Result = Result<LoadInboxResponse>;
}

#[derive(Debug)]
pub struct LoadEmail(pub Uuid);

impl Message for LoadEmail {
    type Result = Result<Email>;
}

#[derive(Debug)]
pub struct LoadAttachment(pub Uuid);

impl Message for LoadAttachment {
    type Result = Result<Attachment>;
}
