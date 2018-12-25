use rocket::request::FromRequest;
use rocket::{request, Outcome, Request};

pub struct User {}

impl<'a, 'b> FromRequest<'a, 'b> for User {
    type Error = failure::Error;

    fn from_request(req: &'a Request<'b>) -> request::Outcome<Self, Self::Error> {
        let name = match req.cookies().get_private("NAME") {
            Some(c) => c,
            _ => return Outcome::Forward(()),
        };
        let password = match req.cookies().get_private("PASSWORD") {
            Some(c) => c,
            _ => return Outcome::Forward(()),
        };
        if name.value() == std::env::var("CLIENT_USERNAME").unwrap().as_str()
            && password.value() == std::env::var("CLIENT_PASSWORD").unwrap().as_str()
        {
            Outcome::Success(User {})
        } else {
            Outcome::Forward(())
        }
    }
}

/*
impl User {
    pub fn attempt_login(
        conn: &MindmapDB,
        name: &str,
        password: &str,
        ip: &str,
    ) -> Result<(User, UserToken), failure::Error> {
        let user = match DatabaseUser::load_by_name(conn, name)? {
            Some(u) => u,
            None => {
                // TODO: Validate password anyway to prevent timing attacks
                bail!("Login credentials are invalid");
            }
        };
        let result = pbkdf2_check(password, &user.password)
            .map_err(|e| format_err!("Could not validate password: {}", e))?;

        if !result {
            bail!("Login credentials are invalid");
        }
        let token = UserToken::create(conn, user.id, ip)?;
        Ok((user.into(), token))
    }

    pub fn attempt_register(
        conn: &MindmapDB,
        name: &str,
        password: &str,
        ip: &str,
    ) -> Result<(User, UserToken), failure::Error> {
        if DatabaseUser::load_by_name(conn, name)?.is_some() {
            bail!("Username already in use");
        }

        let password = pbkdf2_simple(password, 10_000)?;

        let user = DatabaseUser::create(conn, name, &password)?;
        let token = UserToken::create(conn, user.id, ip)?;

        Ok((user.into(), token))
    }

    pub fn load_by_id(conn: &MindmapDB, id: Uuid) -> Result<User, failure::Error> {
        match DatabaseUser::load_by_id(conn, id)? {
            Some(u) => Ok(u.into()),
            None => bail!("User not found"),
        }
    }
}
*/
