#[macro_use]
pub extern crate diesel;

mod models;
mod schema;

pub use models::*;

pub type Conn = diesel::pg::PgConnection;
