use crate::rocket_utils::{Connection, Error, PeerAddr};
pub use database::user::Token;
use database::user::User as DbUser;
use rocket::request::{FromRequest, Outcome, Request};
use uuid::Uuid;

type Result<T> = std::result::Result<T, Error>;

wrap_database!(User(DbUser) {
    pub fn load_by_id(conn: &Connection, id: Uuid) -> Result<User>;
    pub fn load_by_login_name(conn: &Connection, name: &str) -> Result<User>;
    pub fn load_by_email(conn: &Connection, email: &str) -> Result<User>;
    pub fn register(conn: &Connection, login_name: &str, password: &str, email: &str, request_id: Uuid) -> Result<User>;
});

impl<'a, 'r> FromRequest<'a, 'r> for User {
    type Error = !;
    fn from_request(request: &'a Request<'r>) -> Outcome<Self, Self::Error> {
        let mut cookies = request.cookies();
        let (uid_cookie, tid_cookie) =
            match (cookies.get_private("UID"), cookies.get_private("TID")) {
                (Some(uid), Some(tid)) => (uid, tid),
                _ => return Outcome::Forward(()),
            };

        let mut remove_tokens_and_forward = || {
            cookies.remove(uid_cookie.clone());
            cookies.remove(tid_cookie.clone());
            Outcome::<Self, Self::Error>::Forward(())
        };

        let (user_id, token_id) = match (
            Uuid::parse_str(uid_cookie.value()),
            Uuid::parse_str(tid_cookie.value()),
        ) {
            (Ok(user_id), Ok(token_id)) => (user_id, token_id),
            _ => return remove_tokens_and_forward(),
        };

        let conn = request.guard::<Connection>().unwrap();
        let peer_addr = request.guard::<PeerAddr>().unwrap();

        let user = match DbUser::load_by_id(conn.get(), user_id) {
            Ok(u) => u,
            Err(e) => {
                eprintln!("Could not load user: {:?}", e);
                return remove_tokens_and_forward();
            }
        };

        let token = match Token::load_by_user_and_id(conn.get(), &user, token_id) {
            Ok(t) => t,
            Err(e) => {
                eprintln!("Could not load user token: {:?}", e);
                return remove_tokens_and_forward();
            }
        };

        if token.ip != peer_addr.0.to_string() {
            remove_tokens_and_forward()
        } else {
            Outcome::Success(User(user))
        }
    }
}
