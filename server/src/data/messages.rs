use actix::dev::Message;
use crate::Result;
use shared::attachment::Attachment;
use shared::email::Email;
use shared::inbox::{Inbox, LoadInboxResponse};
use uuid::Uuid;

#[derive(Debug)]
pub struct ListAddresses;

impl Message for ListAddresses {
    type Result = Result<ListAddressResult>;
}

#[derive(Debug)]
pub struct ListAddressResult(pub Vec<Inbox>);

#[derive(Debug)]
pub struct LoadInbox(pub Uuid);

impl Message for LoadInbox {
    type Result = Result<LoadInboxResponse>;
}

#[derive(Debug)]
pub struct LoadEmail(pub Uuid);

#[derive(Serialize)]
pub struct LoadEmailResponse {
    pub email: Email,
}

impl Message for LoadEmail {
    type Result = Result<LoadEmailResponse>;
}

#[derive(Debug)]
pub struct LoadAttachment(pub Uuid);

#[derive(Debug, Serialize)]
pub struct LoadAttachmentResponse {
    pub attachment: Attachment,
}

impl Message for LoadAttachment {
    type Result = Result<LoadAttachmentResponse>;
}
