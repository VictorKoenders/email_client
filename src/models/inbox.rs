use crate::models::email::EmailHeader;
use crate::schema::inbox;
use diesel::prelude::*;
use uuid::Uuid;

#[derive(Serialize, Queryable)]
pub struct Inbox {
    pub id: Uuid,
    pub name: String,
}

impl Inbox {
    pub fn load_all(conn: &diesel::PgConnection) -> Result<Vec<Inbox>, failure::Error> {
        inbox::table.get_results(conn).map_err(Into::into)
    }

    pub fn load_by_id(
        conn: &diesel::PgConnection,
        id: Uuid,
    ) -> Result<Option<Inbox>, failure::Error> {
        inbox::table
            .find(id)
            .get_result(conn)
            .optional()
            .map_err(Into::into)
    }

    pub fn load_email_headers(
        &self,
        conn: &diesel::PgConnection,
    ) -> Result<Vec<EmailHeader>, failure::Error> {
        EmailHeader::load_by_inbox_id(conn, self.id)
    }
}
