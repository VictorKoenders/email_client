use super::Client;
use actix::Addr;

#[derive(Message)]
#[rtype(usize)]
pub struct Connect {
    pub client_addr: Addr<Client>,
}

#[derive(Message)]
pub struct Disconnect {
    pub id: usize,
}
