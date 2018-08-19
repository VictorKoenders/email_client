use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Address {
    pub id: Uuid,
    pub short_name: String,
    pub mail_address: String,

    #[serde(skip_deserializing)]
    pub unseen_count: i32,
}

impl Address {
    pub fn new(short_name: String, mail_address: String) -> Address {
        Address {
            id: Uuid::nil(),
            short_name,
            mail_address,
            unseen_count: 0,
        }
    }
}

#[derive(Serialize)]
pub struct Email {
    pub from: String,
    pub to: String,
    pub subject: String,
    pub body: String,
    pub seen: bool,
}
