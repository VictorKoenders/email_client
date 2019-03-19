use super::email::Email;
use super::email_header::EmailHeader;
use crate::schema::{email, email_part};
use crate::Conn;
use diesel::backend::Backend;
use diesel::deserialize::FromSql;
use diesel::prelude::*;
use diesel::serialize::ToSql;
use diesel::sql_types::SmallInt;
use hashbrown::HashMap;
use std::io::Write;
use uuid::Uuid;

#[derive(Queryable)]
pub struct EmailPart {
    pub id: Uuid,
    pub email_id: Uuid,
    pub r#type: i16,
    pub file_name: Option<String>,
    pub body: Vec<u8>,
}

#[derive(Insertable)]
#[table_name = "email_part"]
struct EmailPartInsert<'a> {
    email_id: Uuid,
    type_: EmailPartType,
    file_name: Option<&'a str>,
    body: &'a [u8],
}

impl EmailPart {
    pub fn create(
        connection: &Conn,
        email: &Email,
        r#type: EmailPartType,
        file_name: Option<&str>,
        body: &[u8],
    ) -> QueryResult<EmailPart> {
        diesel::insert_into(email_part::table)
            .values(EmailPartInsert {
                email_id: email.id,
                type_: r#type,
                file_name,
                body,
            })
            .get_result(connection)
    }

    pub fn load_html_and_text_grouped_by_email(
        conn: &Conn,
    ) -> QueryResult<HashMap<Uuid, HashMap<Uuid, EmailPartWithHeaders>>> {
        let email_parts: Vec<EmailPart> = email_part::table
            .filter(diesel::dsl::exists(
                email::table.filter(
                    email::dsl::body_text_id
                        .eq(email_part::dsl::id.nullable())
                        .or(email::dsl::body_html_id.eq(email_part::dsl::id.nullable())),
                ),
            ))
            .get_results(conn)?;
        let mut headers = EmailHeader::load_html_and_text_part_headers_grouped_by_email_part(conn)?;
        let mut map = HashMap::new();
        for part in email_parts {
            let headers = headers.remove(&part.id).unwrap_or_else(HashMap::new);
            map.entry(part.email_id)
                .or_insert_with(HashMap::new)
                .insert(part.id, EmailPartWithHeaders::new(part, headers));
        }
        Ok(map)
    }
}

pub struct EmailPartWithHeaders {
    pub id: Uuid,
    pub r#type: EmailPartType,
    pub file_name: Option<String>,
    pub body: Vec<u8>,
    pub headers: HashMap<String, String>,
}

impl EmailPartWithHeaders {
    pub fn new(part: EmailPart, headers: HashMap<String, String>) -> EmailPartWithHeaders {
        EmailPartWithHeaders {
            id: part.id,
            r#type: part.r#type.into(),
            file_name: part.file_name,
            body: part.body,
            headers,
        }
    }
}

#[derive(Debug, Copy, Clone, PartialEq, Eq, PartialOrd, Ord, FromSqlRow, AsExpression)]
#[sql_type = "SmallInt"]
pub enum EmailPartType {
    TextHtml,
    TextPlain,
    Image,
    Application,
    Message,
    Unknown,
}

impl From<i16> for EmailPartType {
    fn from(i: i16) -> EmailPartType {
        match i {
            0 => EmailPartType::TextHtml,
            1 => EmailPartType::TextPlain,
            2 => EmailPartType::Image,
            3 => EmailPartType::Application,
            4 => EmailPartType::Message,
            _ => EmailPartType::Unknown,
        }
    }
}

impl<SmallInt, DB> FromSql<SmallInt, DB> for EmailPartType
where
    i16: FromSql<SmallInt, DB>,
    DB: Backend,
{
    fn from_sql(value: Option<&<DB as Backend>::RawValue>) -> diesel::deserialize::Result<Self> {
        <i16 as FromSql<SmallInt, DB>>::from_sql(value).map(EmailPartType::from)
    }
}

impl<DB> ToSql<SmallInt, DB> for EmailPartType
where
    DB: Backend,
{
    fn to_sql<W: Write>(
        &self,
        out: &mut diesel::serialize::Output<W, DB>,
    ) -> diesel::serialize::Result {
        <i16 as ToSql<SmallInt, DB>>::to_sql(&(*self as i16), out)
    }
}
