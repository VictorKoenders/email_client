use crate::schema::email_attachment;
use diesel::prelude::*;
use uuid::Uuid;

#[derive(Serialize, Queryable)]
pub struct EmailAttachmentHeader {
    id: Uuid,
    mime_type: String,
    name: Option<String>,
}

impl EmailAttachmentHeader {
    pub fn load_by_email(
        conn: &diesel::PgConnection,
        id: Uuid,
    ) -> Result<Vec<EmailAttachmentHeader>, failure::Error> {
        email_attachment::table
            .filter(email_attachment::dsl::email_id.eq(id))
            .select((
                email_attachment::dsl::id,
                email_attachment::dsl::mime_type,
                email_attachment::dsl::name,
            ))
            .get_results(conn)
            .map_err(Into::into)
    }
}

#[derive(Serialize, Queryable)]
pub struct EmailAttachment {
    pub id: Uuid,
    pub email_id: Uuid,
    pub mime_type: String,
    pub name: Option<String>,
    pub content_id: Option<String>,
    pub contents: Vec<u8>,
}

impl EmailAttachment {
    pub fn load_by_id(
        conn: &diesel::PgConnection,
        id: Uuid,
    ) -> Result<Option<EmailAttachment>, failure::Error> {
        email_attachment::table
            .find(id)
            .get_result(conn)
            .optional()
            .map_err(Into::into)
    }
}
