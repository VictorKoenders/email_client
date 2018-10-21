use super::Loadable;
use crate::data::schema::{email, inbox, inbox_address};
use crate::Result;
use diesel::dsl::count_star;
use diesel::dsl::exists;
use diesel::pg::PgConnection;
use diesel::{BoolExpressionMethods, ExpressionMethods, OptionalExtension, QueryDsl, RunQueryDsl};
use shared::inbox::Inbox;
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

impl<'a> Loadable<'a, Uuid> for Option<NamedInbox> {
    fn load(connection: &PgConnection, id: Uuid) -> Result<Option<NamedInbox>> {
        let query = inbox::table
            .select((inbox::dsl::id, inbox::dsl::name))
            .find(id);
        query.get_result(connection).optional().map_err(Into::into)
    }
}

pub struct Address<'a>(pub &'a str);

#[derive(Debug, Serialize, Queryable)]
pub struct NamedInbox {
    pub id: Uuid,
    pub name: String,
}
impl<'a> Loadable<'a, Address<'a>> for Option<NamedInbox> {
    fn load(connection: &PgConnection, address: Address<'a>) -> Result<Option<NamedInbox>> {
        let query = inbox::table.select((inbox::id, inbox::name)).filter(exists(
            inbox_address::table.filter(
                inbox_address::inbox_id
                    .eq(inbox::id)
                    .and(inbox_address::address.eq(address.0)),
            ),
        ));

        query.get_result(connection).optional().map_err(Into::into)
    }
}

/*
#[derive(Debug, Serialize, Deserialize)]
#[deprecated(note = "Use shared::inbox::Inbox instead")]
pub struct InboxWithAddress {
    pub id: Uuid,
    pub name: String,
    pub addresses: Vec<String>,
    pub unread_count: i32,
}

#[derive(Queryable)] //, QueryableByName)]
#[deprecated(note = "Use shared::inbox::InboxHeader instead")]
pub struct InboxWithUnread {
    // #[sql_type = "UuidType"]
    pub id: Uuid,

    // #[sql_type = "Text"]
    pub name: String,

    // #[sql_type = "Nullable<BigInt>"]
    pub unread_count: Option<i64>,
}
impl InboxWithAddress {
    pub fn load(connection: &PgConnection) -> Result<Vec<InboxWithAddress>> {
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
        let inboxes: Vec<InboxWithUnread> = query.get_results(connection)?;
        let addresses: Vec<(Uuid, String)> = inbox_address::table.get_results(connection)?;
        Ok(inboxes
            .into_iter()
            .map(|inbox| InboxWithAddress {
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
                unread_count: inbox.unread_count.unwrap_or(0) as i32,
            })
            .collect())
    }

    pub fn load_by_id(connection: &PgConnection, id: &Uuid) -> Result<InboxWithAddress> {
        let query = inbox::table
            .select((
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
            ))
            .find(id);
        let inbox: InboxWithUnread = query.get_result(connection)?;
        /*::diesel::sql_query(
            "SELECT id, name, (SELECT COUNT(*) FROM email WHERE email.inbox_id == inbox.id AND email.read = false) AS unread_count FROM inbox WHERE id = $1"
        ).bind::<UuidType, _>(id).get_result(connection)?;*/
let addresses: Vec<String> = inbox_address::table
.select(inbox_address::address)
.filter(inbox_address::inbox_id.eq(&inbox.id))
.get_results(connection)?;
Ok(InboxWithAddress {
id: inbox.id,
name: inbox.name,
addresses,
unread_count: inbox.unread_count.unwrap_or(0) as i32,
})
}
}

#[derive(Debug, Queryable, QueryableByName)]
#[table_name = "inbox"]
#[deprecated(note = "Use shared::inbox::Inbox instead")]
pub struct Inbox {
pub id: Uuid,
pub name: String,
}

impl Inbox {
pub fn try_load_by_address(connection: &PgConnection, address: &str) -> Result<Option<Inbox>> {
let query = inbox::table.select((inbox::id, inbox::name)).filter(exists(
inbox_address::table.filter(
inbox_address::inbox_id
.eq(inbox::id)
.and(inbox_address::address.eq(address)),
),
));

query.get_result(connection).optional().map_err(Into::into)
}
}

*/
