use super::email_attachment::EmailAttachmentHeader;
use crate::schema::email;
use chrono::{DateTime, Utc};
use diesel::prelude::*;
use std::collections::HashMap;
use uuid::Uuid;

#[derive(Serialize, Queryable)]
pub struct EmailHeader {
    pub id: Uuid,
    pub from: Option<String>,
    pub to: Option<String>,
    pub subject: Option<String>,
    pub created_on: DateTime<Utc>,
    pub read: bool,
}

impl EmailHeader {
    pub fn load_by_inbox_id(
        conn: &diesel::PgConnection,
        id: Uuid,
    ) -> Result<Vec<EmailHeader>, failure::Error> {
        email::table
            .select((
                email::dsl::id,
                email::dsl::from,
                email::dsl::to,
                email::dsl::subject,
                email::dsl::created_on,
                email::dsl::read,
            ))
            .filter(email::dsl::inbox_id.eq(id))
            .order_by(email::dsl::created_on.desc())
            .get_results(conn)
            .map_err(Into::into)
    }
}

#[derive(Serialize, Queryable)]
pub struct Email {
    pub id: Uuid,
    pub inbox_id: Uuid,
    pub created_on: DateTime<Utc>,
    pub impa_index: i32,
    pub from: Option<String>,
    pub to: Option<String>,
    pub subject: Option<String>,
    pub text_plain_body: Option<String>,
    pub html_body: Option<String>,
    pub html_body_raw: Option<String>,
    pub raw: Vec<u8>,
    pub read: bool,
}

impl Email {
    pub fn load_by_id(
        conn: &diesel::PgConnection,
        id: Uuid,
    ) -> Result<Option<Email>, failure::Error> {
        email::table
            .find(id)
            .get_result(conn)
            .optional()
            .map_err(Into::into)
    }

    pub fn load_headers(
        &self,
        conn: &diesel::PgConnection,
    ) -> Result<HashMap<String, String>, failure::Error> {
        super::email_header::EmailHeader::load_by_email(conn, self.id)
    }

    pub fn load_attachment_headers(
        &self,
        conn: &diesel::PgConnection,
    ) -> Result<Vec<EmailAttachmentHeader>, failure::Error> {
        EmailAttachmentHeader::load_by_email(conn, self.id)
    }

    pub fn set_read(&mut self, conn: &diesel::PgConnection) -> Result<(), failure::Error> {
        diesel::update(email::table.find(self.id))
            .set(email::dsl::read.eq(true))
            .execute(conn)?;
        self.read = true;
        Ok(())
    }
}
