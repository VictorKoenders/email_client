use super::{schema, Connection, EmailHeader, Result, User, Uuid};
use diesel::prelude::*;

#[derive(QueryableByName)]
pub struct InboxHeader {
    #[sql_type = "diesel::sql_types::Uuid"]
    pub id: Uuid,
    #[sql_type = "diesel::sql_types::Text"]
    pub name: String,
    #[sql_type = "diesel::sql_types::Bigint"]
    pub unread_count: i64,
}

pub struct Inbox {
    pub id: Uuid,
    pub name: String,
    pub emails: Vec<EmailHeader>,
}

#[derive(Queryable)]
struct InboxNoEmails {
    pub id: Uuid,
    pub name: String,
}

impl Inbox {
    pub fn load_by_user(conn: &Connection, _user: &User) -> Result<Vec<InboxHeader>> {
        let result: Vec<InboxHeader> =
            diesel::sql_query(include_str!("../../queries/select_user_inboxes.sql"))
                .get_results(conn)?;
        Ok(result)
    }

    pub fn load_by_id(conn: &Connection, _user: &User, id: Uuid) -> Result<Inbox> {
        let inbox = if id.is_nil() {
            InboxNoEmails {
                id,
                name: String::new(),
            }
        } else {
            schema::user_inbox::table
                .find(id)
                .select((schema::user_inbox::dsl::id, schema::user_inbox::dsl::name))
                .get_result(conn)?
        };

        let emails = EmailHeader::load_by_inbox(conn, inbox.id)?;

        Ok(Inbox {
            id: inbox.id,
            name: inbox.name,
            emails,
        })
    }
}

impl Into<shared::InboxHeader> for InboxHeader {
    fn into(self) -> shared::InboxHeader {
        shared::InboxHeader {
            id: self.id,
            name: self.name,
            unread_count: self.unread_count as usize,
        }
    }
}
