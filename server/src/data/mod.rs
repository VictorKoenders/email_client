pub mod database;
pub mod messages;
pub mod models;
pub mod schema;

pub use self::database::Database;
pub use self::messages::{
    AddNewEmailListener, ListAddresses, LoadAttachment, LoadEmail, LoadInbox, NewEmail,
};
