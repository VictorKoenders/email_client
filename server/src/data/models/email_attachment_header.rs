use super::Loadable;
use crate::data::schema::email_attachment_header;
use crate::Result;
use diesel::pg::PgConnection;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use shared::attachment::Header;
use uuid::Uuid;

#[derive(Queryable)]
struct HeaderLoader {
    pub key: String,
    pub value: String,
}

impl Into<Header> for HeaderLoader {
    fn into(self) -> Header {
        Header {
            key: self.key,
            value: self.value,
        }
    }
}

impl<'a> Loadable<'a, Uuid> for Vec<Header> {
    fn load(connection: &PgConnection, id: Uuid) -> Result<Vec<Header>> {
        let result: Vec<HeaderLoader> = email_attachment_header::table
            .select((
                email_attachment_header::dsl::key,
                email_attachment_header::dsl::value,
            ))
            .filter(email_attachment_header::dsl::email_attachment_id.eq(id))
            .get_results(connection)?;
        Ok(result.into_iter().map(Into::into).collect())
    }
}

pub fn save<'a>(
    connection: &'a PgConnection,
    email_attachment_id: &'a Uuid,
    headers: impl Iterator<Item = (&'a String, &'a String)>,
) -> Result<()> {
    for (key, value) in headers {
        let insert = HeaderInsert {
            email_attachment_id,
            key,
            value,
        };
        ::diesel::insert_into(email_attachment_header::table)
            .values(&insert)
            .execute(connection)?;
    }
    Ok(())
}

#[derive(Insertable)]
#[table_name = "email_attachment_header"]
struct HeaderInsert<'a> {
    email_attachment_id: &'a Uuid,
    key: &'a str,
    value: &'a str,
}
