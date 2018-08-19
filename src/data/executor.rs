use super::{Address, Email};
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
        "SELECT id, created_on, 'from', 'to', subject, body, read FROM email"
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

    pub fn load_emails_by_address(&self, id: &Uuid) -> Result<Vec<Email>> {
        let connection = self.0.get()?;
        const QUERY: &str = concat!(EMAIL_SELECT!(), " where address_id = $1 ", EMAIL_ORDER!());
        let result = connection.query(QUERY, &[id])?;
        Ok(result.into_iter().map(Into::into).collect())
    }
}
