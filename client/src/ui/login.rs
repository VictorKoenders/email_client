use shared::login::LoginRequest;
use yew::prelude::*;

pub enum Msg {}

pub struct Login {
    pub on_attempt_login: Option<Callback<LoginRequest>>,
}

#[derive(Default, Clone, PartialEq)]
pub struct Properties {
    pub on_attempt_login: Option<Callback<LoginRequest>>,
}

impl Component for Login {
    type Message = Msg;
    type Properties = Properties;

    fn create(props: Self::Properties, _: ComponentLink<Self>) -> Self {
        Self {
            on_attempt_login: props.on_attempt_login,
        }
    }

    fn change(&mut self, props: Self::Properties) -> ShouldRender {
        self.on_attempt_login = props.on_attempt_login;
        true
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {}
    }
}

impl Renderable<Login> for Login {
    fn view(&self) -> Html<Login> {
        html! {
            <b>{ "Hello from Login" }</b>
        }
    }
}
