use super::Loadable;
use crate::data::schema::email_header;
use crate::Result;
use diesel::pg::PgConnection;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use shared::email::Header;
use uuid::Uuid;

impl<'a> Loadable<'a, Uuid> for Vec<Header> {
    fn load(connection: &PgConnection, email_id: Uuid) -> Result<Vec<Header>> {
        let query = email_header::table
            .select((email_header::key, email_header::value))
            .filter(email_header::email_id.eq(email_id));
        let result: Vec<(String, String)> = query.get_results(connection)?;
        Ok(result
            .into_iter()
            .map(|(key, value)| Header { key, value })
            .collect())
    }
}
pub fn save<'a>(
    connection: &'a PgConnection,
    email_id: &'a Uuid,
    headers: impl Iterator<Item = (&'a String, &'a String)>,
) -> Result<()> {
    for (key, value) in headers {
        let insert = EmailHeaderInsert {
            email_id,
            key,
            value,
        };
        ::diesel::insert_into(email_header::table)
            .values(&insert)
            .execute(connection)?;
    }
    Ok(())
}

#[derive(Insertable)]
#[table_name = "email_header"]
struct EmailHeaderInsert<'a> {
    email_id: &'a Uuid,
    key: &'a str,
    value: &'a str,
}
