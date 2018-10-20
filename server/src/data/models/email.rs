use super::email_attachment::AttachmentLoader;
use super::email_header::EmailHeaders;
use super::inbox::Inbox;
use super::Loadable;
use data::schema::email;
use diesel::pg::PgConnection;
use diesel::{Connection, ExpressionMethods, QueryDsl, RunQueryDsl};
use message::Message as ImapMessage;
use shared::attachment::AttachmentHeader;
use shared::email::EmailHeader;
use uuid::Uuid;
use Result;

#[derive(Debug, Serialize, Deserialize, Clone, Queryable)]
#[deprecated(note = "Use shared::email::EmailHeader instead")]
pub struct EmailInfo {
    pub id: Uuid,
    pub inbox_id: Uuid,
    pub from: Option<String>,
    pub to: Option<String>,
    pub subject: Option<String>,
    pub read: bool,
}

#[derive(Queryable)]
pub struct EmailResult {
    pub id: Uuid,
    pub inbox_id: Uuid,
    pub from: Option<String>,
    pub to: Option<String>,
    pub subject: Option<String>,
    pub read: bool,
}

impl Into<EmailHeader> for EmailResult {
    fn into(self) -> EmailHeader {
        EmailHeader {
            id: self.id,
            inbox_id: self.inbox_id,
            from: self.from.unwrap_or_else(String::new),
            to: self.to.unwrap_or_else(String::new),
            subject: self.subject.unwrap_or_else(String::new),
            read: self.read,
        }
    }
}

impl EmailInfo {
    pub fn load_by_inbox(connection: &PgConnection, uuid: &Uuid) -> Result<Vec<EmailInfo>> {
        let query = email::table
            .select((
                email::dsl::id,
                email::dsl::inbox_id,
                email::dsl::from,
                email::dsl::to,
                email::dsl::subject,
                email::dsl::read,
            ))
            .filter(email::inbox_id.eq(uuid))
            .order_by(email::dsl::created_on.desc());
        query.get_results(connection).map_err(Into::into)
    }
}

#[derive(Debug, Serialize, Insertable)]
#[table_name = "email"]
pub struct EmailFromImap<'a> {
    pub inbox_id: Uuid,
    pub imap_index: i32,
    pub from: &'a str,
    pub to: &'a str,
    pub subject: &'a str,
    pub text_plain_body: &'a str,
    pub html_body: Option<&'a str>,
    pub html_body_raw: Option<&'a str>,
    pub raw: &'a [u8],
}

#[derive(Debug, Serialize, Insertable)]
#[table_name = "email"]
pub struct EmptyEmailFromImap<'a> {
    pub imap_index: i32,
    pub raw: &'a [u8],
}

impl<'a> EmailFromImap<'a> {
    pub fn save(connection: &PgConnection, message: &ImapMessage) -> Result<EmailHeader> {
        connection.transaction(|| {
            let inbox = Inbox::try_load_by_address(connection, &message.to)?;
            let email = EmailFromImap {
                inbox_id: inbox.map(|i| i.id).unwrap_or_else(Uuid::nil),
                imap_index: message.imap_index,
                from: &message.from,
                to: &message.to,
                subject: &message.to,
                text_plain_body: &message.plain_text_body,
                html_body: message.html_body.as_ref().map(|s| s.as_str()),
                html_body_raw: message.html_body_raw.as_ref().map(|s| s.as_str()),
                raw: &message.raw,
            };
            let result: EmailResult = ::diesel::insert_into(email::table)
                .values(&email)
                .returning((
                    email::dsl::id,
                    email::dsl::inbox_id,
                    email::dsl::from,
                    email::dsl::to,
                    email::dsl::subject,
                    email::dsl::read,
                ))
                .get_result(connection)?;

            EmailHeaders::save(connection, &result.id, message.headers.iter())?;
            for attachment in &message.attachments {
                AttachmentLoader::save(connection, &result.id, attachment)?;
            }

            Ok(result.into())
        })
    }
    pub fn save_empty(connection: &PgConnection, message: &ImapMessage) -> Result<()> {
        let email = EmptyEmailFromImap {
            imap_index: message.imap_index,
            raw: &message.raw,
        };
        ::diesel::insert_into(email::table)
            .values(&email)
            .execute(connection)?;
        Ok(())
    }
}

#[deprecated(note = "Use shared::email::Email instead")]
#[derive(Serialize)]
pub struct Email {
    pub id: Uuid,
    pub inbox_id: Uuid,
    pub from: Option<String>,
    pub to: Option<String>,
    pub subject: Option<String>,
    pub read: bool,
    pub imap_index: i32,
    pub text_plain_body: Option<String>,
    pub html_body: Option<String>,

    pub headers: EmailHeaders,
    pub attachments: Vec<AttachmentHeader>,
}

#[derive(Queryable)]
struct EmailLoadByIDResult {
    pub id: Uuid,
    pub inbox_id: Uuid,
    pub from: Option<String>,
    pub to: Option<String>,
    pub subject: Option<String>,
    pub read: bool,
    pub imap_index: i32,
    pub text_plain_body: Option<String>,
    pub html_body: Option<String>,
}

impl Email {
    pub fn load_by_id(connection: &PgConnection, id: Uuid) -> Result<Email> {
        let email: EmailLoadByIDResult = email::table
            .find(id)
            .select((
                email::id,
                email::inbox_id,
                email::from,
                email::to,
                email::subject,
                email::read,
                email::imap_index,
                email::text_plain_body,
                email::html_body,
            ))
            .get_result(connection)?;

        if !email.read {
            ::diesel::update(email::table.find(id))
                .set(email::read.eq(true))
                .execute(connection)?;
        }

        let headers = EmailHeaders::load_by_email(connection, &email.id)?;
        let attachments = Loadable::load(connection, id)?;

        Ok(Email {
            id: email.id,
            inbox_id: email.inbox_id,
            from: email.from,
            to: email.to,
            subject: email.subject,
            read: email.read,
            imap_index: email.imap_index,
            text_plain_body: email.text_plain_body,
            html_body: email.html_body,

            headers,
            attachments,
        })
    }
}
