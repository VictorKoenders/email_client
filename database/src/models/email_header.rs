use super::email::Email;
use super::email_part::EmailPart;
use crate::schema::email_header;
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
    key: String,
    value: String,
}

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
            .select((
                email_header::dsl::email_id,
                email_header::dsl::key,
                email_header::dsl::value,
            )).get_results(conn)?;
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
            .select((
                email_header::dsl::email_id,
                email_header::dsl::key,
                email_header::dsl::value,
            ))
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
            .select((
                email_header::dsl::email_id,
                email_header::dsl::key,
                email_header::dsl::value,
            ))
            .get_results(conn)?;
        let mut map = HashMap::with_capacity(headers.len());
        for header in headers {
            map.insert(header.key, header.value);
        }
        Ok(map)
    }
}
