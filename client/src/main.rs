#[macro_use]
extern crate yew;

mod network;
mod ui;

use crate::network::*;
use crate::ui::inbox_blocks::InboxBlocks;
use crate::ui::inbox_list::InboxList;
use crate::ui::login::Login;
use shared::login::LoginRequest;
use shared::ServerToClient;
use std::rc::Rc;
use std::time::Duration;
use yew::prelude::*;
use yew::services::console::ConsoleService;
use yew::services::timeout::*;
use yew::services::websocket::*;

pub struct Model {
    pub network: Network,
    pub reconnect_callback: Callback<()>,
    pub reconnect_timeout: Option<TimeoutTask>,
    pub console: ConsoleService,
    pub state: State,
}

pub enum State {
    NotAuthenticated,
    Authenticated(AuthenticatedModel),
}

pub struct AuthenticatedModel {
    pub inboxes: Vec<Rc<Inbox>>,
    pub current_inbox: Option<Rc<Inbox>>,
    pub current_editing_inbox: Option<Rc<Inbox>>,
}

#[derive(Debug, PartialEq)]
pub struct Inbox {
    pub id: String,
    pub name: String,
    pub unread_count: usize,
}

#[derive(Debug)]
pub enum Msg {
    SelectInbox(usize),
    EditInbox(usize),
    Reconnect,
    Connected(WebSocketStatus),
    DataReceived(DataResult<ServerToClient>),
    AttemptLogin(LoginRequest),
}

impl Component for Model {
    type Message = Msg;
    type Properties = ();

    fn create(_: Self::Properties, mut link: ComponentLink<Self>) -> Self {
        Model {
            network: Network::create(&mut link),
            reconnect_callback: link.send_back(|_| Msg::Reconnect),
            reconnect_timeout: None,
            console: ConsoleService::new(),
            state: State::NotAuthenticated,
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::SelectInbox(index) => {
                if let State::Authenticated(state) = &mut self.state {
                    state.current_inbox = Some(state.inboxes[index].clone());
                    true
                } else {
                    false
                }
            }
            Msg::EditInbox(index) => {
                if let State::Authenticated(state) = &mut self.state {
                    state.current_editing_inbox = Some(state.inboxes[index].clone());
                    true
                } else {
                    false
                }
            }
            Msg::Reconnect => {
                self.reconnect_timeout = None;
                self.network.reconnect();
                false
            }
            Msg::Connected(state) => {
                ConsoleService::new().log(&format!("Connected: {:?}", state));
                if let WebSocketStatus::Opened = state {
                    self.network.load_inboxes();
                } else {
                    self.disconnect_and_reconnect_network();
                }
                false
            }
            Msg::DataReceived(DataResult(Ok(msg))) => {
                ConsoleService::new().log(&format!("Received data from server: {:?}", msg));
                true
            }
            Msg::DataReceived(DataResult(Err(e))) => {
                ConsoleService::new().error(&format!("Connection to server failed: {:?}", e));
                self.disconnect_and_reconnect_network();
                false
            }
            Msg::AttemptLogin(request) => {
                self.network.attempt_login(request);
                false
            }
        }
    }
}

impl Model {
    fn disconnect_and_reconnect_network(&mut self) {
        self.network.disconnect();
        let task =
            TimeoutService::new().spawn(Duration::from_secs(5), self.reconnect_callback.clone());
        self.reconnect_timeout = Some(task);
    }
}

impl Renderable<Model> for Model {
    fn view(&self) -> Html<Self> {
        if let State::Authenticated(state) = &self.state {
            if let Some(inbox) = &state.current_inbox {
                html! {
                    <>
                        <InboxList:
                            inboxes=state.inboxes.clone(),
                            on_select=Msg::SelectInbox,
                            current=Some(inbox.clone()),
                        />
                    </>
                }
            } else {
                html!{
                    <InboxBlocks:
                        inboxes=state.inboxes.clone(),
                        on_select=Msg::SelectInbox,
                    />
                }
            }
        } else {
            html! {
                <Login: on_attempt_login=Msg::AttemptLogin, />
            }
        }
    }
}

fn main() {
    yew::initialize();
    App::<Model>::new().mount_to_body();
    yew::run_loop();
}
