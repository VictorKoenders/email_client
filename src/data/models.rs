use postgres::rows::Row;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Address {
    pub id: Uuid,
    pub short_name: String,
    pub mail_address: String,

    #[serde(skip_deserializing)]
    pub unseen_count: i64,
}

impl<'a> From<Row<'a>> for Address {
    fn from(row: Row) -> Address {
        let id = row.get(0);
        let short_name = row.get(1);
        let mail_address = row.get(2);
        let unseen_count = row.get(3);
        Address {
            id,
            short_name,
            mail_address,
            unseen_count,
        }
    }
}

#[derive(Debug, Serialize)]
pub struct Email {
    pub id: Uuid,
    pub created_on: String,
    pub from: String,
    pub to: String,
    pub subject: String,
    pub body: String,
    pub seen: bool,
}

impl<'a> From<Row<'a>> for Email {
    fn from(row: Row) -> Email {
        let id = row.get(0);
        let created_on = row.get(1);
        let from = row.get(2);
        let to = row.get(3);
        let subject = row.get(4);
        let body = row.get(5);
        let seen = row.get(6);
        Email {
            id,
            created_on,
            from,
            to,
            subject,
            body,
            seen,
        }
    }
}
