use crate::models::User;
use rocket::http::{Cookie, Cookies, Status};
use rocket::request::{FromRequest, Outcome, Request};

pub struct Auth(pub User);

const COOKIE_NAME: &str = "AUTH";

impl Auth {
    pub fn set_cookie(cookies: &mut Cookies, token: String) {
        let cookie = Cookie::new(COOKIE_NAME, token.to_string());
        cookies.add_private(cookie);
    }
}

impl<'a, 'r> FromRequest<'a, 'r> for Auth {
    type Error = UnauthenticatedError;

    fn from_request(request: &'a Request<'r>) -> Outcome<Self, Self::Error> {
        let id = match request
            .cookies()
            .get_private(COOKIE_NAME)
            .and_then(|u| uuid::Uuid::parse_str(u.value()).ok())
        {
            Some(id) => id,
            None => {
                println!("Cookie not set, or could not parse");
                return Outcome::Failure((
                    Status::Unauthorized,
                    UnauthenticatedError::Unauthorized,
                ));
            }
        };
        println!("Id: {:?}", id);
        let db: crate::DbConn = match request.guard() {
            Outcome::Success(d) => d,
            _ => {
                println!("Database connection not set ");
                return Outcome::Failure((
                    Status::InternalServerError,
                    UnauthenticatedError::DatabaseConnectionNotFound,
                ));
            }
        };
        match User::load_by_token(&db, id) {
            Ok(Some(user)) => Outcome::Success(Auth(user)),
            Ok(None) => {
                println!("Token not found");
                Outcome::Failure((Status::Unauthorized, UnauthenticatedError::Unauthorized))
            }
            Err(e) => {
                println!("Query error: {:?}", e);
                Outcome::Failure((
                    Status::InternalServerError,
                    UnauthenticatedError::QueryError(e),
                ))
            }
        }
    }
}

#[derive(Debug)]
pub enum UnauthenticatedError {
    Unauthorized,
    DatabaseConnectionNotFound,
    QueryError(failure::Error),
}
