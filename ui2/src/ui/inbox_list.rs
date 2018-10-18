use yew::html::{Component, Renderable, ShouldRender, ComponentLink, Html};
use std::rc::Rc;
use crate::Inbox;

pub enum Msg {
}

pub struct InboxList {
    pub inboxes: Vec<Rc<Inbox>>,
    pub current_inbox: Rc<Inbox>,
}

impl Component for InboxList {
    type Message = Msg;
    type Properties = (
        Vec<Rc<Inbox>>,
        Option<Rc<Inbox>>,
    );
    
    fn create(props: Self::Properties, link: ComponentLink<Self>) -> Self {
        InboxList {
            inboxes: props.0,
            current_inbox: props.1.unwrap(),
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        false
    }
}

impl Renderable<InboxList> for InboxList {
    fn view(&self) -> Html<InboxList> {
        html! {
            <b>{ "Hello from InboxList" }</b>
        }
    }
}

