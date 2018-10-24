#![recursion_limit = "128"]

#[macro_use]
extern crate yew;

mod network;
mod ui;

use crate::network::*;
use crate::ui::inbox_blocks::InboxBlocks;
use crate::ui::inbox_list::InboxList;
use crate::ui::login::Login;
use shared::inbox::Inbox;
use shared::login::{LoginRequest, LoginResponse};
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
    NotAuthenticated { error: Option<String> },
    Authenticated(AuthenticatedModel),
}

#[derive(Default)]
pub struct AuthenticatedModel {
    pub inboxes: Vec<Rc<Inbox>>,
    pub current_inbox: Option<Rc<Inbox>>,
    pub current_editing_inbox: Option<Rc<Inbox>>,
}
#[derive(Debug)]
pub enum Msg {
    SelectInbox(usize),
    EditInbox(usize),
    Reconnect,
    ResetAuthenticationError,
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
            state: State::NotAuthenticated { error: None },
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::SelectInbox(index) => {
                if let State::Authenticated(state) = &mut self.state {
                    state.current_inbox = Some(state.inboxes[index].clone());
                    self.network.load_inbox(&state.inboxes[index]);
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
            Msg::ResetAuthenticationError => {
                self.state = State::NotAuthenticated { error: None };
                true
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
            Msg::DataReceived(DataResult(Ok(msg))) => self.handle_server_message(msg),
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
    fn handle_server_message(&mut self, msg: ServerToClient) -> ShouldRender {
        match msg {
            ServerToClient::Error(e) => {
                self.state = State::NotAuthenticated { error: Some(e) };
                true
            }
            ServerToClient::LoginResponse(response) => match *response {
                LoginResponse::Success { inboxes } => {
                    self.state = State::Authenticated(AuthenticatedModel {
                        inboxes: inboxes.into_iter().map(Rc::new).collect(),
                        ..Default::default()
                    });
                    true
                }
                LoginResponse::Failed => {
                    self.state = State::NotAuthenticated {
                        error: Some(String::from("Login failed")),
                    };
                    true
                }
            },
            x => {
                ConsoleService::new().error(&format!("Not implemented: {:?}", x));
                false
            }
        }
    }

    fn disconnect_and_reconnect_network(&mut self) {
        self.network.disconnect();
        let task =
            TimeoutService::new().spawn(Duration::from_secs(5), self.reconnect_callback.clone());
        self.reconnect_timeout = Some(task);
    }
}

impl Renderable<Model> for Model {
    fn view(&self) -> Html<Self> {
        match &self.state {
            State::Authenticated(state) => {
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
            }
            State::NotAuthenticated { error } => {
                html! {
                    <Login:
                        on_attempt_login=Msg::AttemptLogin,
                        on_reset_error_message=|_|Msg::ResetAuthenticationError,
                        error=error,
                        />
                }
            }
        }
    }
}

fn main() {
    yew::initialize();
    App::<Model>::new().mount_to_body();
    yew::run_loop();
}
