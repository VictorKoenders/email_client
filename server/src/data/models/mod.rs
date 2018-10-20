use diesel::pg::PgConnection;
use Result;

pub mod email;
pub mod email_attachment;
pub mod email_attachment_header;
pub mod email_header;
pub mod inbox;

pub trait Loadable<'a, T>: Sized {
    fn load(conn: &PgConnection, args: T) -> Result<Self>;
}
