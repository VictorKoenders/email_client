use super::email_attachment::AttachmentLoader;
use super::email_header;
use super::inbox::{Address, NamedInbox};
use super::Loadable;
use crate::data::schema::email;
use crate::message::Message as ImapMessage;
use crate::Result;
use diesel::pg::PgConnection;
use diesel::{Connection, ExpressionMethods, QueryDsl, RunQueryDsl};
use shared::email::{Email, EmailHeader};
use uuid::Uuid;

#[derive(Queryable)]
pub struct EmailLoader {
    pub id: Uuid,
    pub inbox_id: Uuid,
    pub from: Option<String>,
    pub to: Option<String>,
    pub subject: Option<String>,
    pub read: bool,
}

impl Into<EmailHeader> for EmailLoader {
    fn into(self) -> EmailHeader {
        EmailHeader {
            id: self.id,
            inbox_id: self.inbox_id,
            from: self.from,
            to: self.to,
            subject: self.subject,
            read: self.read,
        }
    }
}

impl<'a> Loadable<'a, Uuid> for Vec<EmailHeader> {
    fn load(connection: &PgConnection, id: Uuid) -> Result<Vec<EmailHeader>> {
        let results: Vec<EmailLoader> = email::table
            .select((
                email::dsl::id,
                email::dsl::inbox_id,
                email::dsl::from,
                email::dsl::to,
                email::dsl::subject,
                email::dsl::read,
            ))
            .filter(email::inbox_id.eq(id))
            .order_by(email::dsl::created_on.desc())
            .get_results(connection)?;
        Ok(results.into_iter().map(Into::into).collect())
    }
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
            from: self.from,
            to: self.to,
            subject: self.subject,
            read: self.read,
        }
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
            let inbox: Option<NamedInbox> = Loadable::load(connection, Address(&message.to))?;
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

            email_header::save(connection, &result.id, message.headers.iter())?;
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

impl<'a> Loadable<'a, Uuid> for Email {
    fn load(connection: &PgConnection, id: Uuid) -> Result<Email> {
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

        let headers = Loadable::load(connection, email.id)?;
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
