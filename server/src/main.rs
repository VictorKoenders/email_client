#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate rocket_contrib;

mod auth;
mod cors;
mod gzip;
mod models;
mod utils;

use crate::auth::Auth;
use diesel::Connection;
use rocket::config::{Config, Environment, Value};
use rocket::http::Cookies;
use rocket::response::NamedFile;
use rocket_contrib::databases::diesel as rocket_diesel;
use rocket_contrib::json::Json;
use rocket_contrib::serve::StaticFiles;
use rocket_contrib::uuid::Uuid;
use std::collections::HashMap;
use utils::VecTools;

pub type Result<T> = std::result::Result<T, failure::Error>;

#[get("/")]
fn index() -> std::io::Result<NamedFile> {
    NamedFile::open("static/index.html")
}

#[post("/api/v1/login", data = "<login>")]
fn login(
    conn: DbConn,
    login: Json<shared::LoginRequest>,
    mut cookies: Cookies,
) -> Result<Json<shared::LoginResponse>> {
    let user = models::User::load_by_name(&*conn, &login.name)?;
    let mut user = match user {
        Some(u) => u,
        None => return Ok(Json(shared::LoginResponse::Failed)),
    };
    if !user.validate_password(&login.password) {
        return Ok(Json(shared::LoginResponse::Failed));
    }
    let token = user.generate_token(&conn)?;
    Auth::set_cookie(&mut cookies, token.to_string());
    let inboxes = models::Inbox::load_by_user(&*conn, &user)?;
    Ok(Json(shared::LoginResponse::Success(shared::User {
        id: user.id,
        name: user.name,
        inboxes: inboxes.map_into(),
    })))
}

#[get("/api/v1/try_load_user")]
fn try_load_user(conn: DbConn, user: Option<Auth>) -> Result<Json<shared::LoginResponse>> {
    let user = match user {
        Some(u) => u,
        None => return Ok(Json(shared::LoginResponse::Failed)),
    };
    let inboxes = models::Inbox::load_by_user(&*conn, &user.0)?;
    Ok(Json(shared::LoginResponse::Success(shared::User {
        id: user.0.id,
        name: user.0.name,
        inboxes: inboxes.map_into(),
    })))
}

#[get("/api/v1/load_inboxes")]
fn load_inboxes(conn: DbConn, user: Auth) -> Result<Json<shared::LoginResponse>> {
    let inboxes = models::Inbox::load_by_user(&*conn, &user.0)?;
    Ok(Json(shared::LoginResponse::Success(shared::User {
        id: user.0.id,
        name: user.0.name,
        inboxes: inboxes.map_into(),
    })))
}

#[get("/api/v1/load_inbox?<id>")]
fn load_inbox_by_id(conn: DbConn, user: Auth, id: Uuid) -> Result<Json<shared::LoadInboxResponse>> {
    let inbox = models::Inbox::load_by_id(&conn, &user.0, id.into_inner())?;
    let inboxes = models::Inbox::load_by_user(&conn, &user.0)?;
    Ok(Json(shared::LoadInboxResponse {
        inbox: shared::Inbox {
            id: inbox.id,
            name: inbox.name,
            emails: inbox.emails.map_into(),
        },
        inbox_headers: inboxes.map_into(),
    }))
}

#[get("/api/v1/load_email?<id>")]
fn load_email_by_id(conn: DbConn, _user: Auth, id: Uuid) -> Result<Json<shared::Email>> {
    let email = models::Mail::load_by_id(&conn, id.into_inner())?;
    match email {
        Some(e) => Ok(Json(e.into())),
        None => failure::bail!("Email not found"),
    }
}

#[database("DATABASE_URL")]
struct DbConn(rocket_diesel::PgConnection);

fn main() {
    let _ = dotenv::dotenv();
    let database_url =
        std::env::var("DATABASE_URL").expect("Could not find env variable DATABASE_URL");
    let mut args = std::env::args();
    while let Some(a) = args.next() {
        if a == "--generate-user" {
            let conn = models::Connection::establish(&database_url)
                .expect("Could not connect to database");
            let user_name = args
                .next()
                .expect("Usage: --generate-user <user_name> <password>");
            let password = args
                .next()
                .expect("Usage: --generate-user <user_name> <password>");
            models::User::create(&conn, &user_name, &password).expect("Could not create user");
            println!("Done!");
            return;
        }
    }

    let mut database_config = HashMap::new();
    let mut databases = HashMap::new();

    // This is the same as the following TOML:
    // my_db = { url = "database.sqlite" }
    database_config.insert("url", Value::from(database_url));
    databases.insert("DATABASE_URL", Value::from(database_config));

    let config = Config::build(Environment::Development)
        .extra("databases", databases)
        .address("0.0.0.0")
        .port(8001)
        .finalize()
        .unwrap();

    rocket::custom(config)
        .attach(DbConn::fairing())
        .attach(cors::CORS())
        .attach(gzip::Gzip)
        .mount("/", StaticFiles::from("static"))
        .mount(
            "/",
            routes![
                index,
                login,
                load_inbox_by_id,
                load_email_by_id,
                load_inboxes,
                try_load_user,
            ],
        )
        .launch();
}
