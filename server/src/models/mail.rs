use super::{mail_part::MailPart, schema, Connection, DateTime, Result, Uuid};
use diesel::prelude::*;

pub struct Mail {
    pub id: Uuid,
    pub remote_addr: String,
    pub ssl: bool,
    pub from: String,
    pub received_on: DateTime,
    pub to: Vec<String>,
}

#[derive(Queryable)]
pub struct LoadableMail {
    pub id: Uuid,
    pub remote_addr: String,
    pub ssl: bool,
    pub from: String,
    pub received_on: DateTime,
}

impl Mail {
    pub fn load_by_id(conn: &Connection, id: Uuid) -> Result<Option<Mail>> {
        let mail: Option<LoadableMail> = schema::mail::table
            .find(id)
            .select((
                schema::mail::dsl::id,
                schema::mail::dsl::remote_addr,
                schema::mail::dsl::ssl,
                schema::mail::dsl::from,
                schema::mail::dsl::received_on,
            ))
            .get_result(conn)
            .optional()?;
        let mail = match mail {
            Some(m) => m,
            None => return Ok(None),
        };
        let to: Vec<String> = schema::mail_to::table
            .filter(schema::mail_to::dsl::mail_id.eq(mail.id))
            .select(schema::mail_to::dsl::to)
            .get_results(conn)?;
        Ok(Some(Mail {
            id: mail.id,
            remote_addr: mail.remote_addr,
            ssl: mail.ssl,
            from: mail.from,
            received_on: mail.received_on,
            to,
        }))
    }
}
