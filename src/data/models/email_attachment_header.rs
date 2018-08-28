use data::schema::email_attachment_header;
use diesel::pg::PgConnection;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use std::collections::HashMap;
use uuid::Uuid;
use Result;

#[derive(Queryable)]
pub struct AttachmentHeader {
    pub key: String,
    pub value: String,
}
impl AttachmentHeader {
    pub fn load_by_attachment(
        connection: &PgConnection,
        id: &Uuid,
    ) -> Result<HashMap<String, String>> {
        let result: Vec<AttachmentHeader> = email_attachment_header::table
            .select((
                email_attachment_header::dsl::key,
                email_attachment_header::dsl::value,
            )).filter(email_attachment_header::dsl::email_attachment_id.eq(id))
            .get_results(connection)?;

        let mut map = HashMap::with_capacity(result.len());
        for header in result {
            map.insert(header.key, header.value);
        }
        Ok(map)
    }
    pub fn save<'a>(
        connection: &'a PgConnection,
        email_attachment_id: &'a Uuid,
        headers: impl Iterator<Item = (&'a String, &'a String)>,
    ) -> Result<()> {
        for (key, value) in headers {
            let insert = AttachmentHeaderInsert {
                email_attachment_id,
                key,
                value,
            };
            ::diesel::insert_into(email_attachment_header::table)
                .values(&insert)
                .execute(connection)?;
        }
        Ok(())
    }
}

#[derive(Insertable)]
#[table_name = "email_attachment_header"]
struct AttachmentHeaderInsert<'a> {
    email_attachment_id: &'a Uuid,
    key: &'a str,
    value: &'a str,
}
