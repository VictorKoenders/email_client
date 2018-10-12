use super::models::email::{Email, EmailInfo};
use super::models::email_attachment::{Attachment, AttachmentInfo};
use super::models::inbox::InboxWithAddress;
use actix::dev::Message;
use uuid::Uuid;
use Result;

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
    pub emails: Vec<EmailInfo>,
}

impl Into<::proto::inbox::LoadInboxResponse> for LoadInboxResponse {
    fn into(self) -> ::proto::inbox::LoadInboxResponse {
        let mut response = ::proto::inbox::LoadInboxResponse::default();
        response.id = self.inbox_with_address.id.to_string();
        response.name = self.inbox_with_address.name;
        response.unread_count = self.inbox_with_address.unread_count;
        response.addresses = self.inbox_with_address.addresses.into();
        response.emails = self.emails.into_iter().map(Into::into).collect();

        response
    }
}

impl Message for LoadInbox {
    type Result = Result<LoadInboxResponse>;
}

#[derive(Debug)]
pub struct LoadEmail(pub EmailInfo);

#[derive(Debug, Serialize)]
pub struct LoadEmailResponse {
    pub email: Email,
}

impl Message for LoadEmail {
    type Result = Result<LoadEmailResponse>;
}

#[derive(Debug)]
pub struct LoadAttachment(pub AttachmentInfo);

#[derive(Debug, Serialize)]
pub struct LoadAttachmentResponse {
    pub attachment: Attachment,
}

impl Message for LoadAttachment {
    type Result = Result<LoadAttachmentResponse>;
}
