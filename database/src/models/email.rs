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
    pub is_read: bool,
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
            let headers = headers.remove(&email.id).unwrap_or_default();
            let mut email_parts = email_parts.remove(&email.id).unwrap_or_default();
            let email_text = email.body_text_id.and_then(|id| email_parts.remove(&id));
            let email_html = email.body_html_id.and_then(|id| email_parts.remove(&id));
            result.push(EmailWithHeaders::new(
                email, headers, email_text, email_html,
            ));
        }

        Ok(result)
    }

    pub fn load_by_id(conn: &Conn, id: Uuid) -> QueryResult<FullEmail> {
        let email = email::table.find(id).get_result(conn)?;
        let mut email_parts = EmailPart::load_by_email(conn, &email)?;
        let mut headers = EmailHeader::load_by_email_grouped(conn, &email)?;
        let mut full_email = FullEmail::new(&email, headers.remove(&None).unwrap_or_default());
        if let Some(body_text_id) = email.body_text_id {
            if let Some(body_text) = email_parts.remove(&body_text_id) {
                full_email.body_text = Some(EmailPartWithHeaders::new(
                    body_text,
                    headers.remove(&Some(body_text_id)).unwrap_or_default(),
                ));
            }
        }
        if let Some(body_html_id) = email.body_html_id {
            if let Some(body_html) = email_parts.remove(&body_html_id) {
                full_email.body_html = Some(EmailPartWithHeaders::new(
                    body_html,
                    headers.remove(&Some(body_html_id)).unwrap_or_default(),
                ));
            }
        }
        full_email.parts.reserve(email_parts.len());
        for (id, part) in email_parts {
            full_email.parts.push(EmailPartWithHeaders::new(
                part,
                headers.remove(&Some(id)).unwrap_or_default(),
            ));
        }
        Ok(full_email)
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
    pub is_read: bool,
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
            is_read: email.is_read,
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
        for name in &["To", "to", "X-Original-To"] {
            if let Some(to) = self.try_get_header(name) {
                return to;
            }
        }
        ""
    }
    pub fn get_from(&self) -> &str {
        for name in &["From", "from", "Return-Path"] {
            if let Some(from) = self.try_get_header(name) {
                return &from;
            }
        }
        ""
    }
}

pub struct FullEmail {
    pub id: Uuid,
    pub imap_index: i64,
    pub body_text: Option<EmailPartWithHeaders>,
    pub body_html: Option<EmailPartWithHeaders>,
    pub headers: HashMap<String, String>,
    pub parts: Vec<EmailPartWithHeaders>,
}

impl FullEmail {
    pub fn new(email: &Email, headers: HashMap<String, String>) -> FullEmail {
        FullEmail {
            id: email.id,
            imap_index: email.imap_index,
            body_text: None,
            body_html: None,
            headers,
            parts: Vec::new(),
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
        for name in &["To", "to", "X-Original-To"] {
            if let Some(to) = self.try_get_header(name) {
                return to;
            }
        }
        ""
    }
    pub fn get_from(&self) -> &str {
        for name in &["From", "from", "Return-Path"] {
            if let Some(from) = self.try_get_header(name) {
                return &from;
            }
        }
        ""
    }
}
