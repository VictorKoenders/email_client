use crate::schema::email;
use crate::Conn;
use diesel::prelude::*;
use uuid::Uuid;

#[derive(Queryable)]
pub struct Email {
    pub id: Uuid,
    pub imap_index: i64,
    pub body_text_id: Option<Uuid>,
    pub body_html_id: Option<Uuid>,
}

#[derive(Insertable)]
#[table_name = "email"]
struct EmailInsert {
    imap_index: i64,
}

impl Email {
    pub fn create(connection: &Conn, imap_index: i64) -> QueryResult<Email> {
        diesel::insert_into(email::table)
            .values(EmailInsert { imap_index })
            .get_result(connection)
    }

    pub fn save(&self, connection: &Conn) -> QueryResult<()> {
        diesel::update(email::table.find(self.id))
            .set((
                email::dsl::imap_index.eq(self.imap_index),
                email::dsl::body_text_id.eq(self.body_text_id),
                email::dsl::body_html_id.eq(self.body_html_id),
            ))
            .execute(connection)
            .map(|_| ())
    }
}
