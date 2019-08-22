#[macro_use]
extern crate base64_serde;
extern crate base64;

use base64::STANDARD;
use chrono::{serde::ts_seconds, DateTime, Utc};
use serde::{Deserialize, Serialize};
pub use uuid::Uuid;

base64_serde_type!(Base64Standard, STANDARD);

macro_rules! impl_default_attributes {
    ($(pub $tt:tt $name:ident {$($inner:tt)*})*) => {
        $(
            #[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
            pub $tt $name {
                $($inner)*
            }
        )*
    };
}

impl_default_attributes! {
    pub struct EmailHeader {
        pub id: Uuid,
        pub inbox_id: Uuid,
        pub subject: String,
        pub from: String,
        pub to: String,
        #[serde(with = "ts_seconds")]
        pub received_on: DateTime<Utc>,
        pub unread: bool,
    }

    pub struct Inbox {
        pub id: Uuid,
        pub name: String,
        pub emails: Vec<EmailHeader>,
    }

    pub struct LoginRequest {
        pub name: String,
        pub password: String,
    }

    pub enum LoginResponse {
        Success(User),
        Failed,
    }


    pub struct User {
        pub id: Uuid,
        pub name: String,
        pub inboxes: Vec<InboxHeader>,
    }

    pub struct InboxHeader {
        pub id: Uuid,
        pub name: String,
        pub unread_count: usize,
    }

    pub struct Email {
        pub id: Uuid,
        pub remote_addr: String,
        pub ssl: bool,
        pub from: String,
        pub to: Vec<String>,
        #[serde(with = "ts_seconds")]
        pub received_on: DateTime<Utc>,
        pub unread: bool,

        pub headers: Vec<EmailSmtpHeader>,
        pub parts: Vec<EmailPart>,
    }

    pub struct EmailSmtpHeader {
        pub mail_part_id: Option<Uuid>,
        pub key: String,
        pub value: String,
    }

    pub struct EmailPart {
        pub id: Uuid,
        pub parent_part_id: Option<Uuid>,
        #[serde(with = "Base64Standard")]
        pub body: Vec<u8>,
    }
}

pub trait ResponseTo<T> {}
pub trait RequestOf<T> {}
impl<T, U> RequestOf<T> for U where T: ResponseTo<U> {}

impl ResponseTo<LoginRequest> for LoginResponse {}
