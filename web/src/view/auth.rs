use crate::models::user::{Token, User};
use crate::rocket_utils::{Connection, PeerAddr, RenderTemplate, RequestId, ResponseResult};
use askama::Template;
use rocket::http::{Cookie, Cookies};
use rocket::request::Form;

#[get("/", rank = 2)]
pub fn index() -> ResponseResult {
    IndexModel::default().to_response()
}

#[get("/user/logout")]
pub fn logout(mut cookies: Cookies) -> ResponseResult {
    let cookie_list: Vec<Cookie> = cookies.iter().cloned().collect();
    for cookie in cookie_list {
        cookies.remove(cookie.clone());
        cookies.remove_private(cookie);
    }
    ResponseResult::redirect_to("/")
}

#[post("/user/login", data = "<form>")]
pub fn login_submit(
    form: Form<LoginSubmitModel>,
    conn: Connection,
    mut cookies: Cookies,
    request_id: RequestId,
    ip: PeerAddr,
) -> ResponseResult {
    let (user, token) = match attempt_login(&conn, &form.login_name, &form.password, request_id, ip)
    {
        Err(LoginResult::UserNotFound) | Err(LoginResult::PasswordIncorrect) => {
            return LoginViewModel {
                error: "Could not log in, username / password incorrect",
                login_name: form.login_name.as_str(),
            }
            .to_response();
        }
        Err(LoginResult::Other(e)) => return e.into(),
        Ok(u) => u,
    };

    cookies.add_private(Cookie::new("UID", user.id.to_string()));
    cookies.add_private(Cookie::new("TID", token.id.to_string()));

    ResponseResult::redirect_to("/")
}

#[post("/user/register", data = "<form>")]
pub fn register_submit(
    form: Form<RegisterSubmitModel>,
    conn: Connection,
    mut cookies: Cookies,
    request_id: RequestId,
    ip: PeerAddr,
) -> ResponseResult {
    let error_form = |e: &str| {
        RegisterViewModel {
            error: e,
            login_name: form.login_name.as_str(),
            email: form.email.as_str(),
        }
        .to_response()
    };
    if form.password != form.repeat_password {
        return error_form("Passwords don't match");
    }
    if User::load_by_login_name(&conn, &form.login_name).is_ok() {
        return error_form("Name already in use");
    }
    if User::load_by_email(&conn, &form.email).is_ok() {
        return error_form("Email already in use");
    }

    let user = match User::register(
        &conn,
        &form.login_name,
        &form.password,
        &form.email,
        request_id.0,
    ) {
        Err(e) => {
            return error_form(e.to_string().as_str());
        }
        Ok(u) => u,
    };
    let token = match Token::create_for_user(conn.get(), user.id, request_id.0, &ip.0.to_string()) {
        Ok(token) => token,
        Err(e) => return error_form(e.to_string().as_str()),
    };

    cookies.add_private(Cookie::new("UID", user.id.to_string()));
    cookies.add_private(Cookie::new("TID", token.id.to_string()));

    ResponseResult::redirect_to("/")
}

#[derive(Template, Default)]
#[template(path = "landing_page.html")]
pub struct IndexModel;

#[derive(Template, Default)]
#[template(path = "login.html")]
pub struct LoginViewModel<'a> {
    pub error: &'a str,
    pub login_name: &'a str,
}

#[derive(FromForm)]
pub struct LoginSubmitModel {
    pub login_name: String,
    pub password: String,
}

#[derive(Template, Default)]
#[template(path = "register.html")]
pub struct RegisterViewModel<'a> {
    pub error: &'a str,
    pub login_name: &'a str,
    pub email: &'a str,
}

#[derive(FromForm)]
pub struct RegisterSubmitModel {
    pub login_name: String,
    pub password: String,
    pub repeat_password: String,
    pub email: String,
}

pub enum LoginResult {
    UserNotFound,
    PasswordIncorrect,
    Other(crate::rocket_utils::Error),
}

fn attempt_login(
    conn: &Connection,
    login_name: &str,
    password: &str,
    request_id: RequestId,
    ip: PeerAddr,
) -> Result<(User, Token), LoginResult> {
    let user =
        database::user::User::load_by_login_name(conn.get(), login_name).map_err(|e| match e {
            database::diesel::result::Error::NotFound => LoginResult::UserNotFound,
            e => LoginResult::Other(e.into()),
        })?;
    if user.verify_password(password) {
        let token = Token::create_for_user(conn.get(), user.id, request_id.0, &ip.0.to_string())
            .map_err(|e| LoginResult::Other(e.into()))?;
        Ok((user.into(), token))
    } else {
        Err(LoginResult::PasswordIncorrect)
    }
}
