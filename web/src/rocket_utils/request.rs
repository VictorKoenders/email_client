use crate::rocket_utils::Connection;
use chrono::Utc;
use database::request::{FinalizeRequest, RequestInsert};
use rocket::http::Status;
use rocket::request::{FromRequest, Outcome, Request};
use uuid::Uuid;

#[derive(Debug, Clone, Copy)]
pub struct RequestId(pub Uuid);

impl<'a, 'r> FromRequest<'a, 'r> for RequestId {
    type Error = failure::Error;
    fn from_request(request: &'a Request<'r>) -> Outcome<Self, Self::Error> {
        let conn = request.guard::<Connection>().unwrap();

        let request_insert = RequestInsert {
            url: request.uri().path(),
            headers: request.headers().iter().fold(String::new(), |acc, header| {
                format!("{}{}: {}\n", acc, header.name(), header.value())
            }),
            created_on: Utc::now(),
        };

        let id = match request_insert.save(&*conn) {
            Ok(id) => id,
            Err(e) => return Outcome::Failure((Status::InternalServerError, e)),
        };

        Outcome::Success(*request.local_cache(|| RequestId(id)))
    }
}

impl RequestId {
    pub fn finalize(&self) -> FinalizeRequest {
        FinalizeRequest::create(self.0)
    }
}
