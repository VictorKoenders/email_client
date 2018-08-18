mod serve;

use self::serve::{bundle, bundle_map, index, style};
use actix_web::{server, App};
use std::thread::spawn;

#[derive(Default)]
pub struct State {}

pub fn serve() {
    spawn(|| {
        server::new(|| {
            App::with_state(State::default())
                .resource("/", |r| r.f(index))
                .resource("/style.css", |r| r.f(style))
                .resource("/bundle.js", |r| r.f(bundle))
                .resource("/bundle.js.map", |r| r.f(bundle_map))
        }).bind("127.0.0.1:8001")
        .expect("Can not bind on port 8001")
        .run();
    });
}
