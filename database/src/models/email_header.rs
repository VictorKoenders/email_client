use super::email::Email;
use super::email_part::EmailPart;
use crate::schema::{email, email_header};
use crate::Conn;
use diesel::prelude::*;
use hashbrown::HashMap;
use uuid::Uuid;

pub struct EmailHeader;

#[derive(Insertable)]
#[table_name = "email_header"]
struct EmailHeaderInsert<'a> {
    email_id: Uuid,
    email_part_id: Option<Uuid>,
    key: &'a str,
    value: &'a str,
}

#[derive(Queryable)]
struct EmailHeaderQuery {
    email_id: Uuid,
    email_part_id: Option<Uuid>,
    key: String,
    value: String,
}

const EMAIL_HEADER_QUERY_SELECT: (
    email_header::dsl::email_id,
    email_header::dsl::email_part_id,
    email_header::dsl::key,
    email_header::dsl::value,
) = (
    email_header::dsl::email_id,
    email_header::dsl::email_part_id,
    email_header::dsl::key,
    email_header::dsl::value,
);

impl EmailHeader {
    pub fn create(
        conn: &Conn,
        email: &Email,
        part: Option<&EmailPart>,
        key: &str,
        value: &str,
    ) -> QueryResult<()> {
        diesel::insert_into(email_header::table)
            .values(EmailHeaderInsert {
                email_id: email.id,
                email_part_id: part.map(|p| p.id),
                key,
                value,
            })
            .execute(conn)
            .map(|_| ())
    }

    pub fn load_all_grouped_by_email(
        conn: &Conn,
    ) -> QueryResult<HashMap<Uuid, HashMap<String, String>>> {
        let headers: Vec<EmailHeaderQuery> = email_header::table
            .filter(email_header::dsl::email_part_id.is_null())
            .select(EMAIL_HEADER_QUERY_SELECT)
            .get_results(conn)?;
        let mut result = HashMap::new();
        for header in headers {
            result
                .entry(header.email_id)
                .or_insert_with(HashMap::new)
                .insert(header.key, header.value);
        }
        Ok(result)
    }

    pub fn load_by_email(conn: &Conn, email: &Email) -> QueryResult<HashMap<String, String>> {
        let headers: Vec<EmailHeaderQuery> = email_header::table
            .filter(
                email_header::dsl::email_id
                    .eq(email.id)
                    .and(email_header::dsl::email_part_id.eq(Option::<Uuid>::None)),
            )
            .select(EMAIL_HEADER_QUERY_SELECT)
            .get_results(conn)?;
        let mut map = HashMap::with_capacity(headers.len());
        for header in headers {
            map.insert(header.key, header.value);
        }
        Ok(map)
    }

    pub fn load_by_email_part(
        conn: &Conn,
        email_part: &EmailPart,
    ) -> QueryResult<HashMap<String, String>> {
        let headers: Vec<EmailHeaderQuery> = email_header::table
            .filter(
                email_header::dsl::email_id
                    .eq(email_part.email_id)
                    .and(email_header::dsl::email_part_id.eq(email_part.id)),
            )
            .select(EMAIL_HEADER_QUERY_SELECT)
            .get_results(conn)?;
        let mut map = HashMap::with_capacity(headers.len());
        for header in headers {
            map.insert(header.key, header.value);
        }
        Ok(map)
    }

    pub fn load_html_and_text_part_headers_grouped_by_email_part(
        conn: &Conn,
    ) -> QueryResult<HashMap<Uuid, HashMap<String, String>>> {
        let headers: Vec<EmailHeaderQuery> = email_header::table
            .filter(diesel::dsl::exists(
                email::table.filter(
                    email::dsl::body_text_id
                        .eq(email_header::dsl::email_part_id.nullable())
                        .or(email::dsl::body_html_id
                            .eq(email_header::dsl::email_part_id.nullable())),
                ),
            ))
            .select(EMAIL_HEADER_QUERY_SELECT)
            .get_results(conn)?;

        let mut map = HashMap::new();
        for header in headers {
            if let Some(email_part_id) = header.email_part_id {
                map.entry(email_part_id)
                    .or_insert_with(HashMap::new)
                    .insert(header.key, header.value);
            }
        }
        Ok(map)
    }
}
