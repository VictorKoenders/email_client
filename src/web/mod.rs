pub mod serve;
pub mod socket;

pub use self::socket::Server as WebsocketServer;

use self::serve::{bundle, bundle_map, download_attachment, index, style};
use self::socket::ws_start;
use actix::Addr;
use actix_web::{server, App};
use data::Database;
use std::env;
use std::thread::spawn;

pub struct State {
    websocket_server: Addr<WebsocketServer>,
    database: Addr<Database>,
}

pub fn serve(addr: Addr<WebsocketServer>, database: Addr<Database>) {
    spawn(move || {
        let client_addr = format!(
            "0.0.0.0:{}",
            env::var("CLIENT_PORT").unwrap_or_else(|_| String::from("0"))
        );
        let server = server::new(move || {
            App::with_state(State {
                websocket_server: addr.clone(),
                database: database.clone(),
            }).resource("/", |r| r.f(index))
            .resource("/style.css", |r| r.f(style))
            .resource("/bundle.js", |r| r.f(bundle))
            .resource("/bundle.js.map", |r| r.f(bundle_map))
            .resource("/ws/", |r| r.f(ws_start))
            .resource("/attachment/{id}", |r| r.f(download_attachment))
        }).bind(&client_addr)
        .unwrap_or_else(|e| panic!("Can not bind on {}: {:?}", client_addr, e));

        println!("Web server listening on:");
        for addr in &server.addrs() {
            println!("- {:?}", addr);
        }

        server.run();
    });
}
