use shared::email::Email;
use std::rc::Rc;
use yew::prelude::*;

pub enum Msg {}

pub struct EmailDisplay {
    pub email: Rc<Email>,
}

#[derive(Default, Clone, PartialEq)]
pub struct Properties {
    pub email: Option<Rc<Email>>,
}

impl Component for EmailDisplay {
    type Message = Msg;
    type Properties = Properties;

    fn create(props: Self::Properties, _: ComponentLink<Self>) -> Self {
        Self {
            email: props.email.unwrap(),
        }
    }

    fn change(&mut self, props: Self::Properties) -> ShouldRender {
        self.email = props.email.unwrap();
        true
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {}
    }
}

impl Renderable<EmailDisplay> for EmailDisplay {
    fn view(&self) -> Html<EmailDisplay> {
        html! {
            <div>
                <h2>{self.email.subject.as_ref().map(String::as_str).unwrap_or("")}</h2>
                {
                    for self.email.text_plain_body
                        .as_ref()
                        .map(String::as_str)
                        .unwrap_or("")
                        .lines()
                        .map(|l| html! { <>{l}<br /></> })
                }
            </div>
        }
    }
}
