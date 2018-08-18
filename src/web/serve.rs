use super::State;
use actix_web::fs::NamedFile;
use actix_web::{HttpRequest, Responder};

pub fn index(_req: &HttpRequest<State>) -> impl Responder {
    NamedFile::open("ui/dist/index.html")
}

pub fn style(_req: &HttpRequest<State>) -> impl Responder {
    NamedFile::open("ui/dist/style.css")
}

pub fn bundle(_req: &HttpRequest<State>) -> impl Responder {
    NamedFile::open("ui/dist/bundle.js")
}

pub fn bundle_map(_req: &HttpRequest<State>) -> impl Responder {
    NamedFile::open("ui/dist/bundle.js.map")
}
