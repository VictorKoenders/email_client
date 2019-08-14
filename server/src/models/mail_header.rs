use super::{Connection, Result, Uuid};
use crate::utils::VecTools;
use chrono::{DateTime, Utc};
use diesel::*;

pub struct EmailHeader {
    pub id: Uuid,
    pub subject: String,
    pub from: String,
    pub to: String,
    pub received_on: DateTime<Utc>,
}

#[derive(QueryableByName)]
struct EmailHeaderQueryable {
    #[sql_type = "sql_types::Uuid"]
    pub id: Uuid,
    #[sql_type = "sql_types::Text"]
    pub subject: String,
    #[sql_type = "sql_types::Text"]
    pub from: String,
    #[sql_type = "sql_types::Text"]
    pub to: String,
    #[sql_type = "sql_types::Timestamptz"]
    pub received_on: DateTime<Utc>,
}

impl Into<EmailHeader> for EmailHeaderQueryable {
    fn into(self) -> EmailHeader {
        EmailHeader {
            id: self.id,
            subject: self.subject,
            from: self.from,
            to: self.to,
            received_on: self.received_on,
        }
    }
}

impl EmailHeader {
    pub fn load_by_inbox(conn: &Connection, inbox_id: uuid::Uuid) -> Result<Vec<EmailHeader>> {
        let headers: Vec<EmailHeaderQueryable> = if inbox_id.is_nil() {
            diesel::sql_query(include_str!(
                "../../queries/select_email_headers_without_inbox.sql"
            ))
            .get_results(conn)?
        } else {
            diesel::sql_query(include_str!(
                "../../queries/select_email_headers_by_inbox.sql"
            ))
            .bind::<sql_types::Uuid, _>(&inbox_id)
            .get_results(conn)?
        };
        Ok(headers.map_into())
    }
}

impl Into<shared::EmailHeader> for EmailHeader {
    fn into(self) -> shared::EmailHeader {
        shared::EmailHeader {
            id: self.id,
            subject: self.subject,
            from: self.from,
            to: self.to,
            received_on: self.received_on,
        }
    }
}