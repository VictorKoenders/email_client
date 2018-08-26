use data::schema::email_header;
use diesel::pg::PgConnection;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use serde::ser::{Serialize, Serializer};
use std::collections::HashMap;
use std::fmt;
use uuid::Uuid;
use Result;

pub struct EmailHeaders(HashMap<String, String>);

impl fmt::Debug for EmailHeaders {
    fn fmt(&self, fmt: &mut fmt::Formatter) -> fmt::Result {
        self.0.fmt(fmt)
    }
}

impl Serialize for EmailHeaders {
    fn serialize<S>(&self, serializer: S) -> ::std::result::Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        self.0.serialize(serializer)
    }
}

impl EmailHeaders {
    pub fn load_by_email(connection: &PgConnection, email_id: &Uuid) -> Result<EmailHeaders> {
        let query = email_header::table
            .select((email_header::key, email_header::value))
            .filter(email_header::email_id.eq(email_id));
        println!(
            "email_header load_by_email: {:?}",
            ::diesel::debug_query::<::diesel::pg::Pg, _>(&query)
        );
        let result: Vec<(String, String)> = query.get_results(connection)?;
        Ok(EmailHeaders(result.into_iter().collect()))
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
}

#[derive(Insertable)]
#[table_name = "email_header"]
struct EmailHeaderInsert<'a> {
    email_id: &'a Uuid,
    key: &'a str,
    value: &'a str,
}
