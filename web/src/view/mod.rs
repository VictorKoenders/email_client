use crate::models::user::User;
use crate::rocket_utils::{Connection, RenderTemplate, ResponseResult};
use askama::Template;
use failure::format_err;
use rocket::Rocket;
use rocket_contrib::uuid::Uuid;

mod auth;

pub struct Header<'a> {
    pub user: &'a User,
    pub current_url: &'a str,
}

impl<'a> Header<'a> {
    pub fn new(user: &'a User, current_url: &'a str) -> Header<'a> {
        Header { user, current_url }
    }

    pub fn nav_item(&self, display_name: &str, url: &str) -> String {
        if self.current_url == url {
            format!(r#"<li class="nav-item active">
                <a class="nav-link" href="{url}">{display_name} <span class="sr-only">(current)</span></a>
            </li>"#, url=url, display_name=display_name)
        } else {
            format!(
                r#"<li class="nav-item">
                <a class="nav-link" href="{url}">{display_name}</a>
            </li>"#,
                url = url,
                display_name = display_name
            )
        }
    }
}

#[get("/")]
pub fn index(user: User, conn: Connection) -> ResponseResult {
    IndexModel {
        header: Header::new(&user, "/"),
        name: &user.name,
        emails: database::email::Email::load_all(&conn)?,
    }
    .to_response()
}

#[derive(Template)]
#[template(path = "index.html")]
pub struct IndexModel<'a> {
    header: Header<'a>,
    name: &'a str,
    emails: Vec<database::email::EmailWithHeaders>,
}

#[get("/e/<id>")]
pub fn view_email(user: User, conn: Connection, id: Uuid) -> ResponseResult {
    let email = database::email::Email::load_by_id(&conn, id.into_inner())?;
    EmailModel {
        header: Header::new(&user, "/e/"),
        show_text: email.body_text.is_some(),
        email: email,
    }
    .to_response()
}

#[get("/e/<id>/text")]
pub fn view_email_text(user: User, conn: Connection, id: Uuid) -> ResponseResult {
    let email = database::email::Email::load_by_id(&conn, id.into_inner())?;
    if email.body_text.is_none() {
        ResponseResult::Error(format_err!("Email has no text body"));
    }
    EmailModel {
        header: Header::new(&user, "/e/"),
        show_text: true,
        email: email,
    }
    .to_response()
}
#[get("/e/<id>/html")]
pub fn view_email_html(user: User, conn: Connection, id: Uuid) -> ResponseResult {
    let email = database::email::Email::load_by_id(&conn, id.into_inner())?;
    if email.body_html.is_none() {
        ResponseResult::Error(format_err!("Email has no html body"));
    }
    EmailModel {
        header: Header::new(&user, "/e/"),
        show_text: false,
        email: email,
    }
    .to_response()
}

#[derive(Template)]
#[template(path = "email.html")]
pub struct EmailModel<'a> {
    header: Header<'a>,
    show_text: bool,
    email: database::email::FullEmail,
}

pub fn route(r: Rocket) -> Rocket {
    r.mount(
        "/",
        routes![
            index,
            view_email,
            view_email_text,
            view_email_html,
            auth::index,
            auth::logout,
            auth::login_submit,
        ],
    )
}
