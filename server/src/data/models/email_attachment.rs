use super::email_attachment_header::HeaderLoader;
use super::Loadable;
use attachment::Attachment as ImapAttachment;
use data::schema::email_attachment;
use diesel::pg::PgConnection;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use shared::attachment::{Attachment, AttachmentHeader};
use uuid::Uuid;
use Result;

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
/*
#[derive(Debug, Serialize, Deserialize, Queryable)]
#[deprecated(note = "Use shared::attachment::AttachmentHeader instead")]
pub struct AttachmentInfo {
    pub id: Uuid,
    pub mime_type: String,
    pub name: Option<String>,
    pub content_id: Option<String>,
}

impl AttachmentInfo {
    pub fn from_id(id: Uuid) -> AttachmentInfo {
        AttachmentInfo {
            id,
            mime_type: String::new(),
            name: None,
            content_id: None,
        }
    }

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

        query.get_results(connection).map_err(Into::into)
    }
}
*/

/*
#[derive(Debug, Serialize)]
#[deprecated(note = "Use shared::attachment::Attachment instead")]
pub struct Attachment {
    pub id: Uuid,
    pub headers: HashMap<String, String>,
    pub mime_type: String,
    pub name: Option<String>,
    pub content_id: Option<String>,
    pub contents: Vec<u8>,
}*/

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
        HeaderLoader::save(connection, &uuid, attachment.headers.iter())?;
        Ok(())
    }
    /*
    pub fn load_by_id(connection: &PgConnection, id: Uuid) -> Result<Attachment> {
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
    */
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
