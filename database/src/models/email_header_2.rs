use super::email_2::Email;
use super::email_part::EmailPart;
use crate::schema::email_header_2;
use crate::Result;
use diesel::prelude::*;
use diesel::PgConnection;
use hashbrown::HashMap;
use uuid::Uuid;

#[derive(Queryable, Insertable)]
#[table_name = "email_header_2"]
pub struct EmailHeader {
    pub id: Uuid,
    pub email_id: Option<Uuid>,
    pub email_part_id: Option<Uuid>,
    pub key: String,
    pub value: String,
}

impl EmailHeader {
    pub fn load_by_email(conn: &PgConnection, email: &Email) -> Result<HashMap<String, String>> {
        let headers: Vec<EmailHeader> = email_header_2::table
            .filter(email_header_2::dsl::email_id.eq(&email.id))
            .get_results(conn)?;
        let mut map = HashMap::with_capacity(headers.len());
        for header in headers {
            map.insert(header.key, header.value);
        }
        Ok(map)
    }

    pub fn load_by_email_part(
        conn: &PgConnection,
        email_part: &EmailPart,
    ) -> Result<HashMap<String, String>> {
        let headers: Vec<EmailHeader> = email_header_2::table
            .filter(email_header_2::dsl::email_part_id.eq(&email_part.id))
            .get_results(conn)?;
        let mut map = HashMap::with_capacity(headers.len());
        for header in headers {
            map.insert(header.key, header.value);
        }
        Ok(map)
    }
}
