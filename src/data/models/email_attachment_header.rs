use data::schema::email_attachment_header;
use diesel::pg::PgConnection;
use diesel::RunQueryDsl;
use uuid::Uuid;
use Result;

pub struct AttachmentHeader {}
impl AttachmentHeader {
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
