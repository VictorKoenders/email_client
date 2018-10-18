use crate::Inbox;
use std::rc::Rc;
use yew::prelude::*;

pub enum Msg {
    SelectInbox(usize),
    EditInbox(usize),
}

pub struct InboxBlocks {
    pub inboxes: Vec<Rc<Inbox>>,
    pub onselect: Option<Callback<usize>>,
}

#[derive(Default, Clone, PartialEq)]
pub struct Properties {
    pub inboxes: Vec<Rc<Inbox>>,
    pub onselect: Option<Callback<usize>>,
}

impl Component for InboxBlocks {
    type Message = Msg;
    type Properties = Properties;

    fn create(props: Self::Properties, _: ComponentLink<Self>) -> Self {
        Self {
            inboxes: props.inboxes,
            onselect: props.onselect,
        }
    }

    fn change(&mut self, props: Self::Properties) -> ShouldRender {
        self.inboxes = props.inboxes;
        self.onselect = props.onselect;
        true
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::SelectInbox(index) => {
                if let Some(onselect) = &self.onselect {
                    onselect.emit(index);
                }
                false
            }
            Msg::EditInbox(_index) => false,
        }
    }
}

impl Renderable<InboxBlocks> for InboxBlocks {
    fn view(&self) -> Html<InboxBlocks> {
        html! {
            <div class="card-columns", >
                {for self.inboxes.iter().enumerate().map(block_menu_tile)}
            </div>
        }
    }
}

fn block_menu_tile((index, inbox): (usize, &Rc<Inbox>)) -> Html<InboxBlocks> {
    html! {
        <div class=("card"), onclick=|_| Msg::SelectInbox(index), >
            <div class="card-body", >
                <span class=("float-right", "oi", "oi-cog"), style="cursor: pointer", onclick=|_| Msg::EditInbox(index), />
                <h5 class=(if inbox.unread_count > 0 { "font-weight-bold" } else { "" }, "card-title"), >
                    { &inbox.name }
                    { format!(" ({})", inbox.unread_count) }</h5
                >
            </div>
        </div>
    }
}
