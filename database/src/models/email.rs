use crate::email_header::EmailHeader;
use crate::email_part::{EmailPart, EmailPartWithHeaders};
use crate::schema::email;
use crate::Conn;
use diesel::prelude::*;
use hashbrown::HashMap;
use uuid::Uuid;

#[derive(Queryable)]
pub struct Email {
    pub id: Uuid,
    pub imap_index: i64,
    pub body_text_id: Option<Uuid>,
    pub body_html_id: Option<Uuid>,
}

#[derive(Insertable)]
#[table_name = "email"]
struct EmailInsert {
    imap_index: i64,
}

impl Email {
    pub fn load_all(connection: &Conn) -> QueryResult<Vec<EmailWithHeaders>> {
        let emails: Vec<Email> = email::table.get_results(connection)?;
        let mut email_parts = EmailPart::load_html_and_text_grouped_by_email(connection)?;
        let mut headers = EmailHeader::load_all_grouped_by_email(connection)?;
        let mut result = Vec::with_capacity(emails.len());
        for email in emails {
            let headers = headers.remove(&email.id).unwrap_or_else(HashMap::new);
            let mut email_parts = email_parts.remove(&email.id).unwrap_or_else(HashMap::new);
            let email_text = email.body_text_id.and_then(|id| email_parts.remove(&id));
            let email_html = email.body_html_id.and_then(|id| email_parts.remove(&id));
            result.push(EmailWithHeaders::new(
                email, headers, email_text, email_html,
            ));
        }

        Ok(result)
    }
    pub fn create(connection: &Conn, imap_index: i64) -> QueryResult<Email> {
        diesel::insert_into(email::table)
            .values(EmailInsert { imap_index })
            .get_result(connection)
    }

    pub fn save(&self, connection: &Conn) -> QueryResult<()> {
        diesel::update(email::table.find(self.id))
            .set((
                email::dsl::imap_index.eq(self.imap_index),
                email::dsl::body_text_id.eq(self.body_text_id),
                email::dsl::body_html_id.eq(self.body_html_id),
            ))
            .execute(connection)
            .map(|_| ())
    }
}

pub struct EmailWithHeaders {
    pub id: Uuid,
    pub imap_index: i64,
    pub body_text: Option<EmailPartWithHeaders>,
    pub body_html: Option<EmailPartWithHeaders>,
    pub headers: HashMap<String, String>,
}

impl EmailWithHeaders {
    pub fn new(
        email: Email,
        headers: HashMap<String, String>,
        body_text: Option<EmailPartWithHeaders>,
        body_html: Option<EmailPartWithHeaders>,
    ) -> EmailWithHeaders {
        EmailWithHeaders {
            id: email.id,
            imap_index: email.imap_index,
            body_text,
            body_html,
            headers,
        }
    }

    fn try_get_header(&self, header: &str) -> Option<&str> {
        if let Some(value) = self.headers.get(header) {
            return Some(value);
        }
        if let Some(body_text) = self.body_text.as_ref() {
            if let Some(value) = body_text.headers.get(header) {
                return Some(value);
            }
        }
        if let Some(body_html) = self.body_html.as_ref() {
            if let Some(value) = body_html.headers.get(header) {
                return Some(value);
            }
        }
        None
    }

    pub fn get_subject(&self) -> &str {
        for name in &["Subject", "subject"] {
            if let Some(subject) = self.try_get_header(name) {
                return subject;
            }
        }
        ""
    }
    pub fn get_to(&self) -> &str {
        for name in &["To", "to"] {
            if let Some(to) = self.try_get_header(name) {
                return to;
            }
        }
        ""
    }
    pub fn get_from(&self) -> &str {
        for name in &["From", "from"] {
            if let Some(from) = self.try_get_header(name) {
                return &from;
            }
        }
        ""
    }
}
