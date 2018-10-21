use crate::Inbox;
use std::rc::Rc;
use yew::prelude::*;

pub enum Msg {
    InboxClicked(usize),
}

pub struct InboxList {
    pub inboxes: Vec<Rc<Inbox>>,
    pub current_inbox: Option<Rc<Inbox>>,
    pub on_select: Option<Callback<usize>>,
}

#[derive(Default, Clone, PartialEq)]
pub struct Properties {
    pub inboxes: Vec<Rc<Inbox>>,
    pub current: Option<Rc<Inbox>>,
    pub on_select: Option<Callback<usize>>,
}

impl Component for InboxList {
    type Message = Msg;
    type Properties = Properties;

    fn create(props: Self::Properties, _: ComponentLink<Self>) -> Self {
        InboxList {
            inboxes: props.inboxes,
            current_inbox: props.current,
            on_select: props.on_select,
        }
    }

    fn change(&mut self, props: Self::Properties) -> ShouldRender {
        self.inboxes = props.inboxes;
        self.current_inbox = props.current;
        self.on_select = props.on_select;
        true
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::InboxClicked(index) => {
                if let Some(on_select) = &self.on_select {
                    on_select.emit(index);
                }
                false
            }
        }
    }
}

impl Renderable<InboxList> for InboxList {
    fn view(&self) -> Html<InboxList> {
        html! {
            <ul>
                {for self.inboxes.iter().enumerate().map(|(index, inbox)| inbox_tile(index, inbox, &self.current_inbox))}
            </ul>
        }
    }
}

fn inbox_tile(index: usize, inbox: &Rc<Inbox>, current: &Option<Rc<Inbox>>) -> Html<InboxList> {
    let is_active = Some(inbox) == current.as_ref();
    html! {
        <li onclick=|_| Msg::InboxClicked(index), >
            {if is_active {
                html! { <b>{&inbox.name}</b> }
            } else {
                html! { {&inbox.name}}
            }}
        </li>
    }
}
