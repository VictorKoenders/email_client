#![recursion_limit = "128"]

#[macro_use]
extern crate yew;

mod network;
mod ui;

use crate::network::*;
use crate::ui::email_display::EmailDisplay;
use crate::ui::email_list::EmailList;
use crate::ui::inbox_blocks::InboxBlocks;
use crate::ui::inbox_list::InboxList;
use crate::ui::login::Login;
use shared::email::{Email, EmailHeader};
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
    pub emails: Vec<Rc<EmailHeader>>,
    pub current_email: Option<Rc<Email>>,
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
    EmailSelected(usize),
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
                if let WebSocketStatus::Opened = state {
                    false
                } else {
                    self.disconnect_and_reconnect_network()
                }
            }
            Msg::DataReceived(DataResult(Ok(msg))) => self.handle_server_message(msg),
            Msg::DataReceived(DataResult(Err(e))) => {
                self.console
                    .error(&format!("Connection to server failed: {:?}", e));
                self.disconnect_and_reconnect_network();
                false
            }
            Msg::AttemptLogin(request) => {
                self.network.attempt_login(request);
                false
            }
            Msg::EmailSelected(index) => {
                if let State::Authenticated(state) = &mut self.state {
                    if let Some(email) = &state.emails.get(index) {
                        self.network.load_email(email);
                    }
                }
                false
            }
        }
    }
}

impl Model {
    fn handle_server_message(&mut self, msg: ServerToClient) -> ShouldRender {
        match msg {
            ServerToClient::Version(version) => {
                self.console
                    .log(&format!("Server version is {:?}", version));
                false
            }
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
            ServerToClient::LoadInboxResponse(response) => {
                if let State::Authenticated(model) = &mut self.state {
                    if let Some(inbox) = &model.current_inbox {
                        if inbox.id == response.inbox.id {
                            model.emails = response.emails.into_iter().map(Rc::new).collect();
                            return true;
                        }
                    }
                }
                false
            }
            ServerToClient::LoadEmailResponse(response) => {
                if let State::Authenticated(model) = &mut self.state {
                    for email in &mut model.emails {
                        if email.id == response.id {
                            if !email.read {
                                let mut cloned: EmailHeader = email.as_ref().clone();
                                cloned.read = true;
                                *email = Rc::new(cloned);

                                let mut current_inbox =
                                    model.current_inbox.as_ref().unwrap().as_ref().clone();
                                current_inbox.unread_count -= 1;
                                model.current_inbox = Some(Rc::new(current_inbox));
                            }
                            break;
                        }
                    }
                    model.current_email = Some(Rc::new(*response));
                    return true;
                }
                false
            }
            ServerToClient::NewEmail(email) => {
                self.console.log(&format!("NewEmail: {:?}", email));
                true
            }
            ServerToClient::LoadAttachmentResponse(response) => {
                self.console
                    .log(&format!("LoadAttachmentResponse: {:?}", response));
                true
            }
        }
    }

    fn disconnect_and_reconnect_network(&mut self) -> ShouldRender {
        self.network.disconnect();
        let task =
            TimeoutService::new().spawn(Duration::from_secs(5), self.reconnect_callback.clone());
        self.reconnect_timeout = Some(task);
        self.state = State::NotAuthenticated {
            error: Some(String::from("Disconnected from server")),
        };
        true
    }

    fn render_emails(&self, state: &AuthenticatedModel, _inbox: &Inbox) -> Html<Self> {
        if state.emails.is_empty() {
            html! {
                <b>{ "Inbox is empty" }</b>
            }
        } else {
            let display = if let Some(email) = &state.current_email {
                html! {
                    <EmailDisplay:
                        email=Some(email.clone()),
                    />
                }
            } else {
                html! {
                    <></>
                }
            };
            html! {
                <div class="row", >
                    <div class={if state.current_email.is_some() { "col-md-4" } else { "" }},
                        style="overflow-y: auto", >
                        <EmailList:
                            emails=state.emails.clone(),
                            email_selected=Msg::EmailSelected,
                        />
                    </div>
                    <div class="col-md-8",
                        style="overflow-y: auto", >
                        {display}
                    </div>
                </div>
            }
        }
    }

    fn render_inboxes(&self, state: &AuthenticatedModel) -> Html<Self> {
        if let Some(inbox) = &state.current_inbox {
            html! {
                <>
                    <div>
                        <InboxList:
                            inboxes=state.inboxes.clone(),
                            on_select=Msg::SelectInbox,
                            current=Some(inbox.clone()),
                        />
                    </div>
                    <div class="d-flex flex-row", >
                        {self.render_emails(state, inbox)}
                    </div>
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
}

impl Renderable<Model> for Model {
    fn view(&self) -> Html<Self> {
        match &self.state {
            State::Authenticated(state) => self.render_inboxes(state),
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
