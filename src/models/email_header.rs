use crate::schema::email_header;
use diesel::prelude::*;
use std::collections::HashMap;
use uuid::Uuid;

#[derive(Queryable)]
pub struct EmailHeader {
    pub email_id: Uuid,
    pub key: String,
    pub value: String,
}

impl EmailHeader {
    pub fn load_by_email(
        conn: &diesel::PgConnection,
        id: Uuid,
    ) -> Result<HashMap<String, String>, failure::Error> {
        let result: Vec<EmailHeader> = email_header::table
            .filter(email_header::dsl::email_id.eq(id))
            .get_results(conn)?;

        let mut map = HashMap::with_capacity(result.len());
        for header in result {
            map.insert(header.key, header.value);
        }
        Ok(map)
    }
}
