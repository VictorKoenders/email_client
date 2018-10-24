use super::Loadable;
use crate::data::schema::{email, inbox, inbox_address};
use crate::Result;
use diesel::dsl::count_star;
use diesel::dsl::exists;
use diesel::pg::PgConnection;
use diesel::{BoolExpressionMethods, ExpressionMethods, OptionalExtension, QueryDsl, RunQueryDsl};
use shared::inbox::{Inbox, InboxHeader};
use uuid::Uuid;

#[derive(Queryable)]
struct InboxLoader {
    pub id: Uuid,
    pub name: String,
    pub unread_count: Option<i64>,
}

impl<'a> Loadable<'a, ()> for Vec<Inbox> {
    fn load(connection: &PgConnection, _: ()) -> Result<Vec<Inbox>> {
        let query = inbox::table.select((
            inbox::dsl::id,
            inbox::dsl::name,
            email::table
                .filter(
                    email::dsl::inbox_id
                        .eq(inbox::dsl::id)
                        .and(email::dsl::read.eq(false)),
                )
                .select(count_star())
                .single_value(),
        ));
        let inboxes: Vec<InboxLoader> = query.get_results(connection)?;
        let addresses: Vec<(Uuid, String)> = inbox_address::table.get_results(connection)?;
        Ok(inboxes
            .into_iter()
            .map(|inbox| Inbox {
                addresses: addresses
                    .iter()
                    .filter_map(|(inbox_id, address)| {
                        if inbox_id == &inbox.id {
                            Some(address.clone())
                        } else {
                            None
                        }
                    })
                    .collect(),
                id: inbox.id,
                name: inbox.name,
                unread_count: inbox.unread_count.unwrap_or(0) as usize,
            })
            .collect())
    }
}

impl<'a> Loadable<'a, Uuid> for Option<InboxHeader> {
    fn load(connection: &PgConnection, id: Uuid) -> Result<Option<InboxHeader>> {
        let query = inbox::table
            .select((inbox::dsl::id, inbox::dsl::name))
            .find(id);

        let inbox_header: Option<InboxHeaderLoader> = query.get_result(connection).optional()?;
        Ok(inbox_header.map(Into::into))
    }
}

pub struct Address<'a>(pub &'a str);

#[derive(Serialize, Queryable)]
struct InboxHeaderLoader {
    pub id: Uuid,
    pub name: String,
}

impl Into<InboxHeader> for InboxHeaderLoader {
    fn into(self) -> InboxHeader {
        InboxHeader {
            id: self.id,
            name: self.name,
        }
    }
}

impl<'a> Loadable<'a, Address<'a>> for Option<InboxHeader> {
    fn load(connection: &PgConnection, address: Address<'a>) -> Result<Option<InboxHeader>> {
        let query = inbox::table.select((inbox::id, inbox::name)).filter(exists(
            inbox_address::table.filter(
                inbox_address::inbox_id
                    .eq(inbox::id)
                    .and(inbox_address::address.eq(address.0)),
            ),
        ));

        let inbox_header: Option<InboxHeaderLoader> = query.get_result(connection).optional()?;
        Ok(inbox_header.map(Into::into))
    }
}
