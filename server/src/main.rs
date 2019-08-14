#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate rocket_contrib;

use diesel::Connection;
use rocket::config::{Config, Environment, Value};
use rocket_contrib::databases::diesel as rocket_diesel;
use rocket_contrib::json::Json;
use std::collections::HashMap;

mod cors;
mod models;

pub type Result<T> = std::result::Result<T, failure::Error>;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[post("/api/v1/login", data = "<login>")]
fn login(conn: DbConn, login: Json<shared::LoginRequest>) -> Result<Json<shared::LoginResponse>> {
    let user = models::User::load_by_name(&*conn, &login.name)?;
    let user = match user {
        Some(u) => u,
        None => return Ok(Json(shared::LoginResponse::Failed)),
    };
    if !user.validate_password(&login.password) {
        return Ok(Json(shared::LoginResponse::Failed));
    }
    let inboxes = models::Inbox::load_by_user(&*conn, &user)?;
    Ok(Json(shared::LoginResponse::Success(shared::User {
        id: user.id,
        name: user.name,
        inboxes: inboxes.into_iter().map(Into::into).collect(),
    })))
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
        .port(8001)
        .finalize()
        .unwrap();

    rocket::custom(config)
        .attach(DbConn::fairing())
        .attach(cors::CORS())
        .mount("/", routes![index, login])
        .launch();
}
