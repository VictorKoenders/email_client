use super::{Connection, Result, User, Uuid};
use diesel::prelude::*;

#[derive(Queryable, QueryableByName)]
pub struct Inbox {
    #[sql_type = "diesel::sql_types::Uuid"]
    pub id: Uuid,
    #[sql_type = "diesel::sql_types::Text"]
    pub name: String,
    #[sql_type = "diesel::sql_types::Bigint"]
    pub unread_count: i64,
}

impl Inbox {
    pub fn load_by_user(conn: &Connection, _user: &User) -> Result<Vec<Inbox>> {
        let result: Vec<Inbox> =
            diesel::sql_query(include_str!("../../queries/select_user_inboxes.sql"))
                .get_results(conn)?;
        Ok(result)
    }
}

impl Into<shared::InboxHeader> for Inbox {
    fn into(self) -> shared::InboxHeader {
        shared::InboxHeader {
            id: self.id,
            name: self.name,
            unread_count: self.unread_count as usize,
        }
    }
}
