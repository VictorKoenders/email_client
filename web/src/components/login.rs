use crate::utils::{Fetch, Lang, TKey};
use yew::prelude::*;

pub enum Msg {
    Noop,
    SetUsername(String),
    SetPassword(String),
    Submit,
    ServerResponse(Result<shared::LoginResponse, failure::Error>),
}

pub struct Login {
    error: String,
    username: String,
    password: String,
    lang: Lang,

    login_fetch_task: Fetch<shared::LoginResponse>,
    onlogin: Option<Callback<shared::User>>,
}

#[derive(Default, Clone, PartialEq)]
pub struct Properties {
    pub onlogin: Option<Callback<shared::User>>,
    pub lang: Lang,
}

impl Component for Login {
    type Message = Msg;
    type Properties = Properties;

    fn create(properties: Self::Properties, mut link: ComponentLink<Self>) -> Self {
        Login {
            error: String::new(),
            username: String::new(),
            password: String::new(),
            login_fetch_task: Fetch::new(&mut link, Msg::ServerResponse),
            onlogin: properties.onlogin,
            lang: properties.lang,
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::Noop => false,
            Msg::SetPassword(pw) => {
                self.password = pw;
                self.error.clear();
                true
            }
            Msg::SetUsername(un) => {
                self.username = un;
                self.error.clear();
                true
            }
            Msg::ServerResponse(response) => {
                self.login_fetch_task.clear();
                match response {
                    Err(e) => {
                        self.error = e.to_string();
                        true
                    }
                    Ok(shared::LoginResponse::Failed) => {
                        self.error = String::from("Login failed");
                        true
                    }
                    Ok(shared::LoginResponse::Success(u)) => {
                        if let Some(onlogin) = self.onlogin.as_ref() {
                            onlogin.emit(u);
                        }
                        false
                    }
                }
            }
            Msg::Submit => {
                self.login_fetch_task.post(
                    "/login",
                    shared::LoginRequest {
                        name: self.username.clone(),
                        password: self.password.clone(),
                    },
                );
                self.error.clear();
                true
            }
        }
    }

    fn change(&mut self, props: Self::Properties) -> ShouldRender {
        let should_render = self.lang != props.lang;

        self.onlogin = props.onlogin;
        self.lang = props.lang;

        should_render
    }
}

impl Renderable<Login> for Login {
    fn view(&self) -> Html<Self> {
        let error_span = if !self.error.is_empty() {
            html! { <span class="alert alert-danger">{&self.error}</span> }
        } else {
            html! {<></>}
        };
        let submit_button = if self.login_fetch_task.running() {
            html! {
                <span class="spinner-border float-right mt-4" role="status">
                    <span class="sr-only">{self.lang.translate(TKey::LabelLoading)}</span>
                </span>
            }
        } else {
            html! { <input type="submit" value=self.lang.translate(TKey::ButtonLogin) class="btn btn-primary float-right mt-4" onclick=|_| Msg::Submit /> }
        };

        html! {
            <div class="center_contents">
                <div class="card login_box">
                    <div class="card-header">
                        {self.lang.translate(TKey::TitleLogin) }
                    </div>
                    {error_span}
                    <div class="card-body">
                        <div class="input-group">
                            <div class="input-group-prepend w-25">
                                <span class="input-group-text w-100" id="label_username">{ self.lang.translate(TKey::LabelUsername) }</span>
                            </div>
                            <input type="text" class="form-control"  aria-label="Username" aria-describedby="label_username"
                                value=&self.username
                                disabled=self.login_fetch_task.running()
                                oninput=|e| Msg::SetUsername(e.value)
                                onkeypress=|e| if e.key() == "Enter" { Msg::Submit } else { Msg::Noop }
                            />
                        </div>
                        <div class="input-group mt-4">
                            <div class="input-group-prepend w-25">
                                <span class="input-group-text w-100" id="label_password">{ "Password" }</span>
                            </div>
                            <input type="password" class="form-control"  aria-label="Password" aria-describedby="label_password"
                                oninput=|e| Msg::SetPassword(e.value)
                                disabled=self.login_fetch_task.running()
                                onkeypress=|e| if e.key() == "Enter" { Msg::Submit } else { Msg::Noop }
                            />
                        </div>
                        {submit_button}
                    </div>
                </div>
            </div>
        }
    }
}
