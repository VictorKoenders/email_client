#![recursion_limit = "512"]
#![feature(proc_macro_hygiene)]
#![feature(unboxed_closures, fn_traits)]

mod components;
mod utils;

use shared::{Email, Inbox, User};
use std::collections::HashMap;
use utils::{Fetch, Lang};
use yew::prelude::*;
use yew::services::ConsoleService;

#[cfg(debug_assertions)]
const BASE_URL: &str = "http://localhost:8001/api/v1";
#[cfg(not(debug_assertions))]
const BASE_URL: &str = "/api/v1";

struct Model {
    lang: Lang,
    user: Option<User>,
    inbox: Option<Inbox>,
    email: Option<Email>,
    fetch_load_inbox: Fetch<shared::Inbox>,
}

#[derive(Debug)]
enum Msg {
    Login(shared::User),
    PathChanged(HashMap<String, String>),
    InboxLoaded(Result<shared::Inbox, failure::Error>),
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
            fetch_load_inbox: Fetch::new(&mut link, Msg::InboxLoaded),
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        ConsoleService::new().log(&format!("{:?}", msg));
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
                let mut did_change = false;
                for (key, value) in params {
                    match key.as_str() {
                        "i" => {
                            did_change = self.inbox.is_some();
                            self.inbox = None;
                            self.fetch_load_inbox
                                .get(&format!("/load_inbox?id={}", value));
                        }
                        k => ConsoleService::new().log(&format!("Unknown param: {:?}", k)),
                    }
                }
                did_change
            }
            Msg::InboxLoaded(inbox) => {
                self.fetch_load_inbox.clear();
                match inbox {
                    Ok(inbox) => self.inbox = Some(inbox),
                    Err(e) => {
                        ConsoleService::new().error(&format!("Could not load inbox: {:?}", e));
                        self.inbox = None;
                    }
                }
                true
            }
        }
    }
}

impl Renderable<Model> for Model {
    fn view(&self) -> Html<Self> {
        use components::{EmailList, InboxList, Login};
        if let Some(u) = self.user.as_ref() {
            let mut items: Vec<Html<Self>> =
                vec![yew::html! { <InboxList inboxes=u.inboxes.clone() lang=self.lang /> }];
            if let Some(i) = self.inbox.as_ref() {
                items.push(yew::html! { <EmailList emails=i.emails.clone() lang=self.lang /> });
                if let Some(e) = self.email.as_ref() {
                    items.push(yew::html! { <div class="col-4">{ format!("TODO: Render email {:?}", e)}</div> });
                }
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
                if let "i" = item {
                    if let Some(val) = iter.next().and_then(|i| i.to_str()) {
                        data.insert(item.to_owned(), val.to_owned());
                    }
                }
            }
        }
    }
    data
}
