use crate::email_header::EmailHeader;
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
        // TODO: also load the body_text_id and body_html_id and their headers
        let emails: Vec<Email> = email::table.get_results(connection)?;
        let mut headers: HashMap<Uuid, HashMap<String, String>> =
            EmailHeader::load_all_grouped_by_email(connection)?;
        let mut result = Vec::with_capacity(emails.len());
        for email in emails {
            let headers = headers.remove(&email.id).unwrap_or_else(HashMap::new);
            result.push(EmailWithHeaders::new(email, headers));
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
    pub body_text_id: Option<Uuid>,
    pub body_html_id: Option<Uuid>,
    pub headers: HashMap<String, String>,
}


impl EmailWithHeaders {
    pub fn new(email: Email, headers: HashMap<String, String>) -> EmailWithHeaders {
        EmailWithHeaders {
            id: email.id,
            imap_index: email.imap_index,
            body_text_id: email.body_text_id,
            body_html_id: email.body_html_id,
            headers,
        }
    }

    pub fn get_subject(&self) -> &str {
        for name in &["Subject"] {
            if let Some(subject) = self.headers.get(*name) {
                return &subject;
            }
        }
        ""
    }
    pub fn get_to(&self) -> &str {
        for name in &["To"] {
            if let Some(to) = self.headers.get(*name) {
                return to;
            }
        }
        ""
    }
    pub fn get_from(&self) -> &str {
        for name in &["From"] {
            if let Some(from) = self.headers.get(*name) {
                return &from;
            }
        }
        ""
    }
}

