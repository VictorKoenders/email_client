#![recursion_limit = "512"]
#![feature(proc_macro_hygiene)]
#![feature(unboxed_closures, fn_traits)]

mod components;
mod utils;

use shared::{Email, Inbox, User};
use std::collections::HashMap;
use utils::{Fetch, Lang};
use yew::prelude::*;
use yew::services::interval::IntervalTask;
use yew::services::{ConsoleService, IntervalService};

#[cfg(debug_assertions)]
const BASE_URL: &str = "http://localhost:8001/api/v1";
#[cfg(not(debug_assertions))]
const BASE_URL: &str = "/api/v1";

struct Model {
    lang: Lang,
    user: Option<User>,
    inbox: Option<Inbox>,
    email: Option<Email>,
    fetch_load_user: Fetch<shared::LoginResponse>,
    fetch_load_inbox: Fetch<shared::LoadInboxResponse>,
    fetch_load_email: Fetch<shared::Email>,
    #[allow(dead_code)]
    interval_task: IntervalTask,
}

#[derive(Debug)]
enum Msg {
    Login(shared::User),
    PathChanged(HashMap<String, String>),
    InboxLoaded(Result<shared::LoadInboxResponse, failure::Error>),
    EmailLoaded(Result<shared::Email, failure::Error>),
    UserLoaded(Result<shared::LoginResponse, failure::Error>),
    TryAuth,
    IntervalTick,
}

impl Component for Model {
    type Message = Msg;
    type Properties = ();
    fn create(_: Self::Properties, mut link: ComponentLink<Self>) -> Self {
        Self {
            lang: Lang::English,
            user: None,
            inbox: None,
            email: None,
            fetch_load_user: Fetch::new(&mut link, Msg::UserLoaded),
            fetch_load_inbox: Fetch::new(&mut link, Msg::InboxLoaded),
            fetch_load_email: Fetch::new(&mut link, Msg::EmailLoaded),
            interval_task: IntervalService::new().spawn(
                std::time::Duration::from_secs(5 * 60),
                link.send_back(|_| Msg::IntervalTick),
            ),
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::Login(user) => {
                self.user = Some(user);
                if let Some(href) = stdweb::web::document()
                    .location()
                    .and_then(|l| l.href().ok())
                {
                    let data = parse_location_href(&href);
                    if !data.is_empty() {
                        self.update(Msg::PathChanged(data));
                    }
                }
                true
            }
            Msg::PathChanged(params) => {
                if let Some(value) = params.get("e") {
                    let is_same = self
                        .email
                        .as_ref()
                        .map(|e| &e.id.to_string() == value)
                        .unwrap_or(false);
                    if !is_same {
                        self.email = None;
                    }
                    self.fetch_load_email
                        .get(&format!("/load_email?id={}", value));
                    !is_same
                } else if let Some(value) = params.get("i") {
                    let is_same = self
                        .inbox
                        .as_ref()
                        .map(|i| &i.id.to_string() == value)
                        .unwrap_or(false);
                    if !is_same {
                        self.inbox = None;
                        self.email = None;
                    }
                    self.fetch_load_inbox
                        .get(&format!("/load_inbox?id={}", value));
                    !is_same
                } else {
                    false
                }
            }
            Msg::UserLoaded(user) => match user {
                Ok(shared::LoginResponse::Success(user)) => {
                    self.user = Some(user);
                    true
                }
                _ => {
                    if self.user.is_some() {
                        self.user = None;
                        self.email = None;
                        self.inbox = None;
                        true
                    } else {
                        false
                    }
                }
            },
            Msg::InboxLoaded(response) => {
                self.fetch_load_inbox.clear();
                match response {
                    Ok(response) => {
                        self.inbox = Some(response.inbox);
                        if let Some(user) = self.user.as_mut() {
                            user.inboxes = response.inbox_headers;
                        }
                    }
                    Err(e) => {
                        ConsoleService::new().error(&format!("Could not load inbox: {:?}", e));
                        self.inbox = None;
                    }
                }
                true
            }
            Msg::EmailLoaded(email) => {
                self.fetch_load_email.clear();
                match email {
                    Ok(email) => {
                        self.email = Some(email);

                        // reload inbox after the email is loaded
                        if let Some(i) = self.inbox.as_ref() {
                            self.fetch_load_inbox
                                .get(&format!("/load_inbox?id={}", i.id));
                        }
                    }
                    Err(e) => {
                        ConsoleService::new().error(&format!("Could not load email: {:?}", e));
                        self.email = None;
                    }
                }
                true
            }
            Msg::TryAuth => {
                self.fetch_load_user.get("/try_load_user");
                false
            }
            Msg::IntervalTick => {
                if !self.fetch_load_user.running() {
                    self.fetch_load_user.get("/try_load_user");
                }
                false
            }
        }
    }
}

impl Model {
    fn column_spinner(size: usize) -> Html<Self> {
        yew::html! {
            <div class={format!("col-{}", size)}>
                <div class="list-group-item-action list-group-item" style="text-align:center">
                    <div role="status" class="spinner-border"></div>
                </div>
            </div>
        }
    }
}
impl Renderable<Model> for Model {
    fn view(&self) -> Html<Self> {
        use components::{EmailList, EmailRender, InboxList, Login};

        if let Some(u) = self.user.as_ref() {
            let mut items: Vec<Html<Self>> =
                vec![yew::html! { <InboxList inboxes=u.inboxes.clone() lang=self.lang /> }];
            if let Some(i) = self.inbox.as_ref() {
                items.push(yew::html! { <EmailList emails=i.emails.clone() lang=self.lang /> });
                if let Some(e) = self.email.as_ref() {
                    items.push(yew::html! { <EmailRender email=Some(e.clone()) lang=self.lang /> });
                } else if self.fetch_load_email.running() {
                    items.push(Model::column_spinner(7))
                }
            } else if self.fetch_load_inbox.running() {
                items.push(Model::column_spinner(3))
            }

            html! { <div class="row">{for items.into_iter()}</div>}
        } else {
            yew::html! { <Login onlogin=Msg::Login lang=self.lang /> }
        }
    }
}

fn main() {
    yew::initialize();
    let mut scope = App::<Model>::new().mount_to_body();
    scope.send_message(Msg::TryAuth);

    use stdweb::web::{event, window, IEventTarget};
    window().add_event_listener(move |e: event::HashChangeEvent| {
        let data = parse_location_href(&e.new_url());
        if !data.is_empty() {
            scope.send_message(Msg::PathChanged(data));
        }
    });

    yew::run_loop();
}

fn parse_location_href(url: &str) -> HashMap<String, String> {
    let mut data = HashMap::new();
    if let Ok(url) = url::Url::parse(&url) {
        if let Some(fragment) = url.fragment() {
            let path = std::path::Path::new(fragment);
            let mut iter = path.iter();
            while let Some(item) = iter.next().and_then(|i| i.to_str()) {
                if ["i", "e"].contains(&item) {
                    if let Some(val) = iter.next().and_then(|i| i.to_str()) {
                        data.insert(item.to_owned(), val.to_owned());
                    }
                }
            }
        }
    }
    data
}
