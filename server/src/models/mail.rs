use super::{schema, Connection, DateTime, Result, Uuid};
use crate::utils::VecTools;
use diesel::prelude::*;

pub struct Mail {
    pub id: Uuid,
    pub remote_addr: String,
    pub ssl: bool,
    pub from: String,
    pub received_on: DateTime,
    pub to: Vec<String>,
    pub unread: bool,

    pub headers: Vec<EmailSmtpHeader>,
    pub parts: Vec<EmailPart>,
}

#[derive(Queryable)]
pub struct EmailSmtpHeader {
    pub id: Uuid,
    pub mail_part_id: Option<Uuid>,
    pub mail_id: Uuid,
    pub key: String,
    pub value: String,
}

#[derive(Queryable)]
pub struct EmailPart {
    pub id: Uuid,
    pub parent_part_id: Option<Uuid>,
    pub mail_id: Uuid,
    pub body: Vec<u8>,
}

#[derive(Queryable)]
pub struct LoadableMail {
    pub id: Uuid,
    pub remote_addr: String,
    pub ssl: bool,
    pub from: String,
    pub received_on: DateTime,
    pub unread: bool,
}

impl Mail {
    pub fn load_by_id(conn: &Connection, id: Uuid) -> Result<Option<Mail>> {
        let loadable_mail: Option<LoadableMail> =
            schema::mail::table.find(id).get_result(conn).optional()?;
        let loadable_mail = match loadable_mail {
            Some(e) => e,
            None => return Ok(None),
        };
        diesel::update(schema::mail::table.find(id))
            .set(schema::mail::dsl::unread.eq(false))
            .execute(conn)?;
        let to: Vec<String> = schema::mail_to::table
            .filter(schema::mail_to::dsl::mail_id.eq(id))
            .select(schema::mail_to::dsl::to)
            .get_results(conn)?;
        let headers: Vec<EmailSmtpHeader> = schema::mail_header::table
            .filter(schema::mail_header::dsl::mail_id.eq(id))
            .get_results(conn)?;
        let parts: Vec<EmailPart> = schema::mail_part::table
            .filter(schema::mail_part::dsl::mail_id.eq(id))
            .get_results(conn)?;

        Ok(Some(Mail {
            id: loadable_mail.id,
            remote_addr: loadable_mail.remote_addr,
            ssl: loadable_mail.ssl,
            from: loadable_mail.from,
            received_on: loadable_mail.received_on,
            unread: loadable_mail.unread,

            to,
            headers,
            parts,
        }))
    }
}

impl Into<shared::Email> for Mail {
    fn into(self) -> shared::Email {
        shared::Email {
            id: self.id,
            remote_addr: self.remote_addr,
            ssl: self.ssl,
            from: self.from,
            to: self.to,
            received_on: self.received_on,
            unread: self.unread,

            headers: self.headers.map_into(),
            parts: self.parts.map_into(),
        }
    }
}

impl Into<shared::EmailSmtpHeader> for EmailSmtpHeader {
    fn into(self) -> shared::EmailSmtpHeader {
        shared::EmailSmtpHeader {
            mail_part_id: self.mail_part_id,
            key: self.key,
            value: self.value,
        }
    }
}

impl Into<shared::EmailPart> for EmailPart {
    fn into(self) -> shared::EmailPart {
        shared::EmailPart {
            id: self.id,
            parent_part_id: self.parent_part_id,
            body: self.body,
        }
    }
}
