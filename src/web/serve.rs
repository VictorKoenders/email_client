use super::State;
use actix_web::fs::NamedFile;
use actix_web::http::StatusCode;
use actix_web::{HttpRequest, HttpResponse, Responder};
use data::messages::LoadAttachment;
use data::models::email_attachment::AttachmentInfo;
use futures::{future, Future};
use uuid::Uuid;

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

pub fn download_attachment(
    req: &HttpRequest<State>,
) -> Box<Future<Item = HttpResponse, Error = ::std::io::Error>> {
    let id = match req.match_info().get("id").map(Uuid::parse_str) {
        Some(Ok(id)) => id,
        x => return Box::new(future::ok(req.response(StatusCode::NOT_FOUND, format!("Expected uuid, got {:?}", x).into()))),
    };

    Box::new(
        req.state()
            .database
            .send(LoadAttachment(AttachmentInfo::from_id(id)))
            .then(|res| match res {
                Ok(Ok(res)) => future::ok(
                    HttpResponse::Ok()
                        .header("Content-Type", res.attachment.mime_type)
                        .header("Content-Transfer-Encoding", "Binary")
                        .header(
                            "Content-disposition",
                            format!(
                                "attachment; filename={:?}",
                                res.attachment
                                    .name
                                    .unwrap_or_else(|| String::from("unknown"))
                            ),
                        )
                        .body(res.attachment.contents),
                ),
                x => future::ok(HttpResponse::InternalServerError().body(format!("{:?}", x))),
            }),
    )
}
