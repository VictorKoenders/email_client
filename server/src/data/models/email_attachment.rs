use super::email_attachment_header::save as save_headers;
use super::Loadable;
use crate::attachment::Attachment as ImapAttachment;
use crate::data::schema::email_attachment;
use crate::Result;
use diesel::pg::PgConnection;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use shared::attachment::{Attachment, AttachmentHeader};
use uuid::Uuid;

#[derive(Queryable)]
struct AttachmentInfo {
    pub id: Uuid,
    pub mime_type: String,
    pub name: Option<String>,
    pub content_id: Option<String>,
}

impl Into<AttachmentHeader> for AttachmentInfo {
    fn into(self) -> AttachmentHeader {
        AttachmentHeader {
            id: self.id,
            mime_type: self.mime_type,
            name: self.name,
            content_id: self.content_id,
        }
    }
}

#[derive(Queryable)]
pub struct AttachmentLoader {
    pub id: Uuid,
    pub mime_type: String,
    pub name: Option<String>,
    pub content_id: Option<String>,
    pub contents: Vec<u8>,
}

impl<'a> Loadable<'a, Uuid> for Vec<AttachmentHeader> {
    fn load(connection: &PgConnection, id: Uuid) -> Result<Vec<AttachmentHeader>> {
        let query = email_attachment::table
            .select((
                email_attachment::dsl::id,
                email_attachment::dsl::mime_type,
                email_attachment::dsl::name,
                email_attachment::dsl::content_id,
            ))
            .filter(email_attachment::dsl::email_id.eq(id));

        let info: Vec<AttachmentInfo> = query.get_results(connection)?;
        Ok(info.into_iter().map(Into::into).collect())
    }
}

impl<'a> Loadable<'a, Uuid> for Attachment {
    fn load(connection: &PgConnection, id: Uuid) -> Result<Attachment> {
        let result: AttachmentLoader = email_attachment::table
            .select((
                email_attachment::dsl::id,
                email_attachment::dsl::mime_type,
                email_attachment::dsl::name,
                email_attachment::dsl::content_id,
                email_attachment::dsl::contents,
            ))
            .find(id)
            .get_result(connection)?;

        let headers = Loadable::load(connection, id)?;

        Ok(Attachment {
            id: result.id,
            headers,
            mime_type: result.mime_type,
            name: result.name,
            content_id: result.content_id,
            contents: result.contents,
        })
    }
}
impl AttachmentLoader {
    pub fn save(
        connection: &PgConnection,
        email_id: &Uuid,
        attachment: &ImapAttachment,
    ) -> Result<()> {
        let insert = AttachmentInsert {
            email_id,
            mime_type: &attachment.mime_type,
            name: attachment.name.as_ref().map(|s| s.as_str()),
            content_id: attachment.content_id.as_ref().map(|s| s.as_str()),
            contents: &attachment.contents,
        };
        let uuid = ::diesel::insert_into(email_attachment::table)
            .values(&insert)
            .returning(email_attachment::dsl::id)
            .get_result(connection)?;
        save_headers(connection, &uuid, attachment.headers.iter())?;
        Ok(())
    }
}

#[derive(Insertable)]
#[table_name = "email_attachment"]
pub struct AttachmentInsert<'a> {
    email_id: &'a Uuid,
    mime_type: &'a str,
    name: Option<&'a str>,
    content_id: Option<&'a str>,
    contents: &'a [u8],
}
