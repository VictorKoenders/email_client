use shared::login::LoginRequest;
use std::mem;
use yew::prelude::*;
use yew::services::ConsoleService;

pub enum Msg {
    Nope,
    UsernameChanged(String),
    PasswordChanged(String),
    Submit,
}

pub struct Login {
    pub on_attempt_login: Option<Callback<LoginRequest>>,
    pub on_reset_error_message: Option<Callback<()>>,
    pub username: String,
    pub password: String,
    pub error: Option<String>,
}

#[derive(Default, Clone, PartialEq)]
pub struct Properties {
    pub on_attempt_login: Option<Callback<LoginRequest>>,
    pub on_reset_error_message: Option<Callback<()>>,
    pub error: Option<String>,
}

impl Component for Login {
    type Message = Msg;
    type Properties = Properties;

    fn create(props: Self::Properties, _: ComponentLink<Self>) -> Self {
        Self {
            on_attempt_login: props.on_attempt_login,
            on_reset_error_message: props.on_reset_error_message,
            error: props.error,
            username: String::new(),
            password: String::new(),
        }
    }

    fn change(&mut self, props: Self::Properties) -> ShouldRender {
        self.on_attempt_login = props.on_attempt_login;
        self.on_reset_error_message = props.on_reset_error_message;
        self.error = props.error;
        true
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::Nope => false,
            Msg::UsernameChanged(un) => {
                self.username = un;
                if self.error.is_some() {
                    if let Some(on_reset_error_message) = &self.on_reset_error_message {
                        on_reset_error_message.emit(());
                    }
                }
                false
            }
            Msg::PasswordChanged(pw) => {
                self.password = pw;
                if self.error.is_some() {
                    if let Some(on_reset_error_message) = &self.on_reset_error_message {
                        on_reset_error_message.emit(());
                    }
                }
                false
            }
            Msg::Submit => {
                let request = LoginRequest {
                    username: mem::replace(&mut self.username, String::new()),
                    password: mem::replace(&mut self.password, String::new()),
                };

                ConsoleService::new().log(&format!("{:?}", request));
                if let Some(on_attempt_login) = &self.on_attempt_login {
                    on_attempt_login.emit(request);
                }
                true
            }
        }
    }
}

impl Renderable<Login> for Login {
    fn view(&self) -> Html<Login> {
        let error = if let Some(error) = &self.error {
            html! { <div class=("alert", "alert-danger"), >{error}</div> }
        } else {
            html! { <></> }
        };
        html! {
            <div class="card", style="width: 30rem; margin: auto;", >
                <div class="card-header", >{"Log in"}</div>
                <div class="card-body", >
                    <div>
                        {error}
                    </div>
                    <div class="form-group",>
                        <label for="username", >{ "Username" }</label>
                        <input
                            type="text",
                            class="form-control",
                            value=&self.username,
                            autoFocus=true,
                            oninput=|e| Msg::UsernameChanged(e.value),
                            onkeypress=|e| {
                                if e.key() == "Enter" { Msg::Submit } else { Msg::Nope }
                            },
                        />
                    </div>
                    <div class="form-group",>
                        <label for="password", >{ "Password" }</label>
                        <input
                            type="password",
                            class="form-control",
                            value=&self.password,
                            oninput=|e| Msg::PasswordChanged(e.value),
                            onkeypress=|e| {
                                if e.key() == "Enter" { Msg::Submit } else { Msg::Nope }
                            },
                        />
                    </div>
                    <button class=("btn", "btn-primary"), type="button", onclick=|_| Msg::Submit, >{"Log in"}</button>
                </div>
            </div>
        }
    }
}
