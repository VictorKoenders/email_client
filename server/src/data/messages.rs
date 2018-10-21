use super::models::inbox::InboxWithAddress;
use actix::dev::Message;
use crate::Result;
use shared::attachment::Attachment;
use shared::email::{Email, EmailHeader};
use uuid::Uuid;

#[derive(Debug)]
pub struct ListAddresses;

impl Message for ListAddresses {
    type Result = Result<ListAddressResult>;
}

#[derive(Debug)]
pub struct ListAddressResult(pub Vec<InboxWithAddress>);

#[derive(Debug)]
pub struct LoadInbox(pub Uuid);

#[derive(Debug, Serialize)]
pub struct LoadInboxResponse {
    pub inbox_with_address: InboxWithAddress,
    pub emails: Vec<EmailHeader>,
}

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
