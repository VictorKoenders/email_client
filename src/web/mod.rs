mod serve;
mod socket;

pub use self::socket::Server as WebsocketServer;

use self::serve::{bundle, bundle_map, index, style};
use self::socket::ws_start;
use actix::Addr;
use actix_web::{server, App};
use data::Database;
use std::thread::spawn;

pub struct State {
    websocket_server: Addr<WebsocketServer>,
    database: Addr<Database>,
}

pub fn serve(addr: Addr<WebsocketServer>, database: Addr<Database>) {
    spawn(move || {
        server::new(move || {
            App::with_state(State {
                websocket_server: addr.clone(),
                database: database.clone(),
            }).resource("/", |r| r.f(index))
            .resource("/style.css", |r| r.f(style))
            .resource("/bundle.js", |r| r.f(bundle))
            .resource("/bundle.js.map", |r| r.f(bundle_map))
            .resource("/ws/", |r| r.f(ws_start))
        }).bind("127.0.0.1:8001")
        .expect("Can not bind on port 8001")
        .run();
    });
}
