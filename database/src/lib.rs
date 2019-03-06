#[macro_use]
pub extern crate diesel;
#[macro_use]
extern crate serde_derive;

pub mod models;
pub mod schema;

pub type Result<T> = std::result::Result<T, failure::Error>;
