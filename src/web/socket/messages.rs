use super::Client;
use actix::Addr;
use std::net::SocketAddr;

#[derive(Message)]
#[rtype(usize)]
pub struct Connect {
    pub client_addr: Addr<Client>,
    pub remote_addr: SocketAddr,
}

#[derive(Message)]
pub struct Disconnect {
    pub id: usize,
}
