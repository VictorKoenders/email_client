#![feature(proc_macro_hygiene, decl_macro)]
#![allow(proc_macro_derive_resolution_fallback)]

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;
#[macro_use]
extern crate serde_derive;

mod either;
mod models;
mod routes;
mod schema;
mod tera_utils;

use crate::either::Either;
use crate::models::email::{Email, EmailHeader};
use crate::models::email_attachment::{EmailAttachment, EmailAttachmentHeader};
use crate::models::inbox::Inbox;
use crate::models::user::User;
use failure::bail;
use rocket::http::{ContentType, Cookie, Cookies, Status};
use rocket::request::Form;
use rocket::response::{Redirect, Response};
use rocket_contrib::databases::diesel::PgConnection;
use rocket_contrib::serve::StaticFiles;
use rocket_contrib::templates::Template;
use std::collections::HashMap;
use uuid::Uuid;

#[database("database")]
pub struct Database(PgConnection);

#[get("/", rank = 1)]
fn inbox_list(_user: User, db: Database) -> Result<Template, failure::Error> {
    let inboxes = Inbox::load_all(&db)?;
    Ok(Template::render("inbox_list", &InboxList { inboxes }))
}

#[derive(Serialize)]
pub struct InboxList {
    inboxes: Vec<Inbox>,
}

#[get("/i/<inbox_id>")]
fn email_list(
    _user: User,
    inbox_id: String,
    db: Database,
) -> Result<Either<Template, Redirect>, failure::Error> {
    let inbox = match Uuid::parse_str(&inbox_id).map(|u| Inbox::load_by_id(&db, u)) {
        Ok(Ok(Some(i))) => i,
        Err(_) | Ok(Ok(None)) => return Ok(Either::Right(Redirect::to("/"))),
        Ok(Err(e)) => return Err(e),
    };

    let emails = inbox.load_email_headers(&db)?;

    Ok(Either::Left(Template::render(
        "email_list",
        &EmailListModel { inbox, emails },
    )))
}

#[derive(Serialize)]
pub struct EmailListModel {
    pub inbox: Inbox,
    pub emails: Vec<EmailHeader>,
}

fn do_view_email(
    email_id: String,
    db: Database,
    force_html: bool,
) -> Result<Either<Template, Redirect>, failure::Error> {
    let mut email = match Uuid::parse_str(&email_id).map(|u| Email::load_by_id(&db, u)) {
        Ok(Ok(Some(e))) => e,
        Err(_) | Ok(Ok(None)) => return Ok(Either::Right(Redirect::to("/"))),
        Ok(Err(e)) => return Err(e),
    };

    if !email.read {
        email.set_read(&db)?;
    }

    let headers = email.load_headers(&db)?;
    let attachments = email.load_attachment_headers(&db)?;

    Ok(Either::Left(Template::render(
        "email_view",
        &EmailViewModel {
            email,
            headers,
            attachments,
            force_html,
        },
    )))
}
#[get("/e/<email_id>")]
fn email_view(
    _user: User,
    email_id: String,
    db: Database,
) -> Result<Either<Template, Redirect>, failure::Error> {
    do_view_email(email_id, db, false)
}

#[get("/e/<email_id>/html")]
fn email_html_view(
    _user: User,
    email_id: String,
    db: Database,
) -> Result<Either<Template, Redirect>, failure::Error> {
    do_view_email(email_id, db, true)
}

#[derive(Serialize)]
pub struct EmailViewModel {
    pub email: Email,
    pub headers: HashMap<String, String>,
    pub attachments: Vec<EmailAttachmentHeader>,
    pub force_html: bool,
}

#[get("/a/<attachment_id>")]
fn load_attachment(
    _user: User,
    db: Database,
    attachment_id: String,
) -> Result<Response<'static>, failure::Error> {
    let attachment_id = Uuid::parse_str(&attachment_id)?;
    let attachment = match EmailAttachment::load_by_id(&db, attachment_id)? {
        Some(a) => a,
        None => bail!("Attachment not found"),
    };
    Ok(Response::build()
        .status(Status::Ok)
        .header(
            ContentType::parse_flexible(&attachment.mime_type).unwrap_or_else(ContentType::default),
        )
        .sized_body(std::io::Cursor::new(attachment.contents))
        .finalize())
}

#[get("/", rank = 2)]
fn login() -> Template {
    Template::render("login", &LoginRenderModel::default())
}

#[post("/login", data = "<data>")]
fn login_submit(mut cookies: Cookies, data: Form<LoginSubmitModel>) -> Either<Template, Redirect> {
    let data = data.into_inner();
    if data.password == std::env::var("CLIENT_PASSWORD").unwrap()
        && data.username == std::env::var("CLIENT_USERNAME").unwrap()
    {
        cookies.add_private(Cookie::new("NAME", data.username));
        cookies.add_private(Cookie::new("PASSWORD", data.password));
        Either::Right(Redirect::to("/"))
    } else {
        Either::Left(Template::render(
            "login",
            &LoginRenderModel {
                username: data.username,
                error: String::from("Invalid login credentials"),
            },
        ))
    }
}

#[derive(Serialize, Default)]
pub struct LoginRenderModel {
    pub username: String,
    pub error: String,
}

#[derive(FromForm)]
pub struct LoginSubmitModel {
    pub username: String,
    pub password: String,
}

fn main() {
    dotenv::dotenv().unwrap();
    rocket::ignite()
        .attach(Database::fairing())
        .attach(Template::custom(|engine| {
            crate::tera_utils::register(&mut engine.tera);
        }))
        .mount(
            "/",
            routes![
                inbox_list,
                login,
                login_submit,
                email_list,
                email_view,
                email_html_view,
                load_attachment
            ],
        )
        .mount("/", StaticFiles::from("static"))
        .launch();
}
