use super::{Address, Email};
use message::Message;
use r2d2::Pool;
use r2d2_postgres::{PostgresConnectionManager, TlsMode};
use std::env;
use uuid::Uuid;
use Result;

pub struct Executor(Pool<PostgresConnectionManager>);

impl Default for Executor {
    fn default() -> Executor {
        let url = env::var("DATABASE_URL").expect("Global variable DATABASE_URL not set");
        let manager = PostgresConnectionManager::new(url, TlsMode::None).unwrap();
        let pool = Pool::new(manager).unwrap();
        Executor(pool)
    }
}

macro_rules! ADDRESS_SELECT {
    () => { "SELECT id, short_name, email_address, (SELECT COUNT(*) FROM email WHERE email.address_id = address.id AND NOT email.read) FROM address" }
}
macro_rules! ADDRESS_ORDER {
    () => {
        "ORDER BY (SELECT MAX(created_on) FROM email where email.address_id = address.id) DESC"
    };
}
macro_rules! EMAIL_SELECT {
    () => {
        "SELECT id, address_id, created_on, \"from\", \"to\", subject, body, read FROM email"
    };
}
macro_rules! EMAIL_INSERT {
    () => {
        "INSERT INTO email (address_id, \"from\", \"to\", subject, body, raw) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_on"
    };
}
macro_rules! EMAIL_VALUES {
    (address_id: $address_id:expr, from: $from:expr, to: $to:expr, subject: $subject:expr, body: $body:expr, raw: $raw:expr) => {
        &[$address_id, $from, $to, $subject, $body, $raw]
    };
}
macro_rules! EMAIL_ORDER {
    () => {
        "ORDER BY created_on DESC"
    };
}

impl Executor {
    pub fn load_addresses(&self) -> Result<Vec<Address>> {
        let connection = self.0.get()?;
        const QUERY: &str = concat!(ADDRESS_SELECT!(), " ", ADDRESS_ORDER!());
        let result = connection.query(QUERY, &[])?;
        Ok(result.into_iter().map(Into::into).collect())
    }

    pub fn load_address_by_id(&self, id: &Uuid) -> Result<Option<Address>> {
        let connection = self.0.get()?;
        const QUERY: &str = concat!(ADDRESS_SELECT!(), " where id = $1");
        let result = connection.query(QUERY, &[id])?;
        if result.is_empty() {
            Ok(None)
        } else {
            Ok(Some(result.into_iter().next().unwrap().into()))
        }
    }

    pub fn load_address_by_email_address(&self, email_address: &str) -> Result<Option<Address>> {
        let connection = self.0.get()?;
        const QUERY: &str = concat!(ADDRESS_SELECT!(), " where email_address = $1");
        let result = connection.query(QUERY, &[&email_address])?;
        if result.is_empty() {
            Ok(None)
        } else {
            Ok(Some(result.into_iter().next().unwrap().into()))
        }
    }
    pub fn load_emails_by_address(&self, id: &Uuid) -> Result<Vec<Email>> {
        let connection = self.0.get()?;
        const QUERY: &str = concat!(EMAIL_SELECT!(), " where address_id = $1 ", EMAIL_ORDER!());
        let result = connection.query(QUERY, &[id])?;
        Ok(result.into_iter().map(Into::into).collect())
    }

    pub fn save(&self, message: Message) -> Result<Email> {
        let from: String = message.from.unwrap_or_else(String::new);
        let to: String = message.to.unwrap_or_else(String::new);
        let subject: String = message.subject.unwrap_or_else(String::new);
        let body: String = message.content.join("\n---\n");

        let connection = self.0.get()?;
        let address = self.load_address_by_email_address(&to)?;
        let address_id: Uuid = address.map(|a| a.id).unwrap_or_else(Uuid::nil);

        const QUERY: &str = EMAIL_INSERT!();
        let result = connection.query(
            QUERY,
            EMAIL_VALUES!(
                address_id: &address_id,
                from: &from,
                to: &to,
                subject: &subject,
                body: &body,
                raw: &message.raw
            ),
        )?;

        let (id, created_on) = match result
            .into_iter()
            .next()
            .map(|rows| (rows.get(0), rows.get(1)))
        {
            Some(r) => r,
            None => bail!("Failed to retrieve ID and created_on from insert query"),
        };

        let email = Email {
            id,
            address_id,
            created_on,
            from,
            to,
            subject,
            body,
            seen: false,
        };

        Ok(email)
    }
}
