use yew::format::{Json, Nothing};
use yew::prelude::*;
use yew::services::fetch::{Credentials, FetchOptions, FetchService, FetchTask, Request, Response};

pub struct Fetch<T: for<'a> serde::Deserialize<'a> + 'static> {
    service: FetchService,
    callback: Callback<Result<T, failure::Error>>,
    current_fetch_task: Option<FetchTask>,
}

impl<T: for<'a> serde::Deserialize<'a> + 'static> Fetch<T> {
    pub fn new<F, U, V>(link: &mut ComponentLink<U>, cb: F) -> Self
    where
        F: Fn(Result<T, failure::Error>) -> V + 'static,
        U: Component<Message = V> + Renderable<U>,
        V: 'static,
    {
        Self {
            service: FetchService::new(),
            callback: link.send_back(cb),
            current_fetch_task: None,
        }
    }

    pub fn get(&mut self, url: &str) {
        let owned_url = url.to_owned();
        let post_request = Request::get(&format!("{}{}", crate::BASE_URL, url))
            .header("Content-Type", "application/json")
            .body(Nothing)
            .expect("Failed to build request.");

        let callback = self.callback.clone();

        let handler = move |response: Response<Json<Result<T, failure::Error>>>| {
            let (meta, Json(data)) = response.into_parts();
            if meta.status.is_success() {
                callback.emit(data)
            } else {
                callback.emit(Err(failure::format_err!(
                    "Could not GET {}{}: {}",
                    crate::BASE_URL,
                    owned_url,
                    meta.status
                )))
            }
        };
        let task = self.service.fetch_with_options(
            post_request,
            FetchOptions {
                credentials: Some(Credentials::Include),
            },
            handler.into(),
        );
        self.current_fetch_task = Some(task);
    }

    pub fn post<U>(&mut self, url: &str, body: U)
    where
        U: serde::Serialize,
        T: shared::ResponseTo<U>,
    {
        let owned_url = url.to_owned();
        let post_request = Request::post(&format!("{}{}", crate::BASE_URL, url))
            .header("Content-Type", "application/json")
            .body(Json(&body))
            .expect("Failed to build request.");

        let callback = self.callback.clone();

        let handler = move |response: Response<Json<Result<T, failure::Error>>>| {
            let (meta, Json(data)) = response.into_parts();
            if meta.status.is_success() {
                callback.emit(data)
            } else {
                callback.emit(Err(failure::format_err!(
                    "Could not POST {}{}: {}",
                    crate::BASE_URL,
                    owned_url,
                    meta.status
                )))
            }
        };
        let task = self.service.fetch_with_options(
            post_request,
            FetchOptions {
                credentials: Some(Credentials::Include),
            },
            handler.into(),
        );
        self.current_fetch_task = Some(task);
    }

    pub fn running(&self) -> bool {
        self.current_fetch_task.is_some()
    }

    pub fn clear(&mut self) {
        self.current_fetch_task = None;
    }
}
