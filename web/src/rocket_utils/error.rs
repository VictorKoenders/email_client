use super::{Connection, RequestId};
use chrono::Utc;
pub use failure::Error;

pub trait RenderTemplate {
    fn to_response(&self) -> ResponseResult;
}

impl<T> RenderTemplate for T
where
    T: askama::Template,
{
    fn to_response(&self) -> ResponseResult {
        match askama::Template::render(self) {
            Ok(str) => str.into(),
            Err(e) => ResponseResult::Error(e.into()),
        }
    }
}

pub enum ResponseResult {
    Ok(rocket::Response<'static>),
    Error(failure::Error),
    Redirect(String),
}

impl ResponseResult {
    pub fn redirect_to(url: &'static str) -> ResponseResult {
        ResponseResult::Redirect(url.to_owned())
    }
}

impl<'a> rocket::response::Responder<'a> for ResponseResult {
    fn respond_to(self, request: &rocket::Request) -> rocket::response::Result<'static> {
        let conn = request.guard::<Connection>().unwrap();
        let request_id = request.guard::<RequestId>().unwrap();
        let mut finalizer = request_id.finalize();
        let result = match self {
            ResponseResult::Ok(response) => {
                finalizer.status = response.status().code;
                response.respond_to(request)
            }
            ResponseResult::Error(e) => {
                finalizer.status = 500;
                eprintln!("{:?}", e);
                let body = format!(
                    "<html><body><h2>Internal server error</h2>If you see any of our code monkeys, please tell them this: {:?}</body></html>",
                    request_id.0
                );
                Ok(rocket::Response::build()
                    .status(rocket::http::Status::InternalServerError)
                    .sized_body(std::io::Cursor::new(body))
                    .finalize())
            }
            ResponseResult::Redirect(s) => {
                finalizer.status = 303;
                rocket::response::Redirect::to(s).respond_to(request)
            }
        };

        finalizer.finished_on = Utc::now();
        if let Err(e) = finalizer.save(&conn) {
            eprintln!("Could not save request finalizer: {:?}", e);
        }

        result
    }
}

impl From<failure::Error> for ResponseResult {
    fn from(e: failure::Error) -> ResponseResult {
        ResponseResult::Error(e)
    }
}

impl From<String> for ResponseResult {
    fn from(str: String) -> ResponseResult {
        let response = rocket::Response::build()
            .status(rocket::http::Status::Ok)
            .header(rocket::http::ContentType::HTML)
            .sized_body(std::io::Cursor::new(str))
            .finalize();
        ResponseResult::Ok(response)
    }
}

impl<'a> From<&'a str> for ResponseResult {
    fn from(str: &'a str) -> ResponseResult {
        let response = rocket::Response::build()
            .status(rocket::http::Status::Ok)
            .header(rocket::http::ContentType::HTML)
            .sized_body(std::io::Cursor::new(str.to_owned()))
            .finalize();
        ResponseResult::Ok(response)
    }
}
