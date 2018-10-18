use crate::{Msg, Inbox, Model};
use std::rc::Rc;
use yew::html::{Html, Renderable};

pub struct InboxBlocks<'a> {
    pub inboxes: &'a [Rc<Inbox>],
}

impl<'a> Renderable<Model> for InboxBlocks<'a> {
    fn view(&self) -> Html<Model> {
        html! {
            <div class="card-columns", >
                {for self.inboxes.iter().enumerate().map(block_menu_tile)}
            </div>
        }
    }
}

fn block_menu_tile((index, inbox): (usize, &Rc<Inbox>)) -> Html<Model> {
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


