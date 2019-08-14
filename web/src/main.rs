#![recursion_limit = "512"]
#![feature(proc_macro_hygiene)]
#![feature(unboxed_closures, fn_traits)]

mod components;
mod utils;

use shared::{Email, Inbox, User};
use yew::prelude::*;
// use yew::services::{ConsoleService, FetchService};
// use shared::EmailHeader;

#[cfg(debug_assertions)]
const BASE_URL: &str = "http://localhost:8001/api/v1";
#[cfg(not(debug_assertions))]
const BASE_URL: &str = "/api/v1";

struct Model {
    lang: utils::Lang,
    user: Option<User>,
    inbox: Option<Inbox>,
    email: Option<Email>,
}

enum Msg {
    Login(shared::User),
}

impl Component for Model {
    type Message = Msg;
    type Properties = ();
    fn create(_: Self::Properties, _: ComponentLink<Self>) -> Self {
        Self {
            lang: utils::Lang::English,
            user: None,
            inbox: None,
            email: None,
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::Login(user) => {
                self.user = Some(user);
                true
            }
        }
    }
}

impl Renderable<Model> for Model {
    fn view(&self) -> Html<Self> {
        use components::{InboxList, Login};
        match (self.user.as_ref(), self.inbox.as_ref(), self.email.as_ref()) {
            (None, _, _) => yew::html! { <Login onlogin=Msg::Login lang=self.lang /> },
            (Some(u), None, _) => yew::html! { <InboxList inboxes=u.inboxes.clone() lang=self.lang /> },
            (Some(u), Some(i), None) => {
                yew::html! { <b>{ format!("TODO: Render inbox email list {:?} {:?}", u, i)}</b> }
            }
            (Some(u), Some(i), Some(e)) => {
                yew::html! { <b>{ format!("TODO: Render inbox email {:?} {:?} {:?}", u, i, e)}</b> }
            }
        }
    }
}

fn main() {
    yew::initialize();
    App::<Model>::new().mount_to_body();
    yew::run_loop();
}
