use super::email_attachment_header::AttachmentHeader;
use attachment::Attachment as ImapAttachment;
use data::schema::email_attachment;
use diesel::pg::PgConnection;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use uuid::Uuid;
use Result;

#[derive(Debug, Serialize, Queryable)]
pub struct AttachmentInfo {
    pub id: Uuid,
    pub mime_type: String,
    pub name: Option<String>,
    pub content_id: Option<String>,
}

impl AttachmentInfo {
    pub fn load_by_email(
        connection: &PgConnection,
        email_id: &Uuid,
    ) -> Result<Vec<AttachmentInfo>> {
        let query = email_attachment::table
            .select((
                email_attachment::dsl::id,
                email_attachment::dsl::mime_type,
                email_attachment::dsl::name,
                email_attachment::dsl::content_id,
            ))
            .filter(email_attachment::dsl::email_id.eq(email_id));

        println!(
            "attachment_info load_by_email: {:?}",
            ::diesel::debug_query::<::diesel::pg::Pg, _>(&query)
        );

        query.get_results(connection).map_err(Into::into)
    }
}

pub struct Attachment {}

impl Attachment {
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
        AttachmentHeader::save(connection, &uuid, attachment.headers.iter())?;
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
