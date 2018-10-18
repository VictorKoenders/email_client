use yew::prelude::*;

pub enum Msg {}

pub struct EmailList {}

#[derive(Default, Clone, PartialEq)]
pub struct Properties {}

impl Component for EmailList {
    type Message = Msg;
    type Properties = Properties;

    fn create(props: Self::Properties, _: ComponentLink<Self>) -> Self {
        Self {}
    }

    fn change(&mut self, props: Self::Properties) -> ShouldRender {
        true
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {}
    }
}

impl Renderable<EmailList> for EmailList {
    fn view(&self) -> Html<EmailList> {
        html! {
            <b>{ "Hello from EmailList" }</b>
        }
    }
}
