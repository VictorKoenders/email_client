mod mail;
mod mail_header;
mod mail_part;
mod mail_to;
pub mod schema;
mod user;
mod user_inbox;
mod user_inbox_address;

pub use self::mail::*;
pub use self::mail_header::*;
pub use self::mail_part::*;
pub use self::mail_to::*;
pub use self::user::*;
pub use self::user_inbox::*;
pub use self::user_inbox_address::*;

pub type Connection = diesel::pg::PgConnection;
pub use uuid::Uuid;
pub type DateTime = chrono::DateTime<chrono::Utc>;
pub type Result<T> = std::result::Result<T, failure::Error>;
