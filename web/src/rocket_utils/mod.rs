mod error;
mod request;

pub use error::{Error, RenderTemplate, ResponseResult};
pub use request::RequestId;

use rocket::request::{FromRequest, Outcome, Request};

#[database("DATABASE")]
pub struct Connection(database::Conn);
impl Connection {
    pub fn get(&self) -> &database::Conn {
        &*self
    }
}

#[derive(Clone, Copy)]
pub struct PeerAddr(pub std::net::IpAddr);

impl<'a, 'r> FromRequest<'a, 'r> for PeerAddr {
    type Error = !;

    fn from_request(request: &'a Request<'r>) -> Outcome<Self, Self::Error> {
        let ip = request
            .client_ip()
            .unwrap_or_else(|| std::net::Ipv4Addr::LOCALHOST.into());
        Outcome::Success(PeerAddr(ip))
    }
}
