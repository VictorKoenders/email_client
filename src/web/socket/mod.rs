pub mod client;
pub mod message;
pub mod server;

pub use self::client::Client;
pub use self::server::Server;

use super::State;
use actix_web::{ws, HttpRequest, HttpResponse, Result};

pub fn ws_start(req: &HttpRequest<State>) -> Result<HttpResponse> {
    ws::start(req, Client::default())
}
