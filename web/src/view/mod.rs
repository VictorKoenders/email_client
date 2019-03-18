use crate::models::user::User;
use crate::rocket_utils::{RenderTemplate, ResponseResult};
use askama::Template;
use rocket::Rocket;

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
pub fn index(user: User) -> ResponseResult {
    IndexModel {
        header: Header::new(&user, "/"),
        name: &user.name,
    }
    .to_response()
}

#[derive(Template)]
#[template(path = "index.html")]
pub struct IndexModel<'a> {
    header: Header<'a>,
    name: &'a str,
}

pub fn route(r: Rocket) -> Rocket {
    r.mount(
        "/",
        routes![
            index,
            auth::index,
            auth::logout,
            auth::login_submit,
            auth::register_submit
        ],
    )
}
