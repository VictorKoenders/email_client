use crate::schema::email_attachment;
use diesel::prelude::*;
use uuid::Uuid;

#[derive(Queryable)]
pub struct EmailAttachmentHeader {
    id: Uuid,
    mime_type: String,
    name: Option<String>,
}

#[derive(Queryable)]
pub struct EmailAttachment {
    id: Uuid,
    email_id: Uuid,
    mime_type: String,
    name: Option<String>,
    content_id: Option<String>,
    contents: Vec<u8>,
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
