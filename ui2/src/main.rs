#[macro_use]
extern crate yew;

mod network;
mod ui;

use crate::ui::inbox_blocks::InboxBlocks;
use crate::ui::inbox_list::InboxList;
use std::rc::Rc;
use yew::prelude::*;
use yew::services::console::ConsoleService;

#[derive(Default)]
pub struct Model {
    pub console: ConsoleService,
    pub inboxes: Vec<Rc<Inbox>>,
    pub current_inbox: Option<Rc<Inbox>>,
    pub current_editing_inbox: Option<Rc<Inbox>>,
}

#[derive(Debug, PartialEq)]
pub struct Inbox {
    pub id: String,
    pub name: String,
    pub unread_count: usize,
}

#[derive(Debug)]
pub enum Msg {
    SelectInbox(usize),
    EditInbox(usize),
}

impl Component for Model {
    type Message = Msg;
    type Properties = ();

    fn create(_: Self::Properties, _: ComponentLink<Self>) -> Self {
        Model {
            inboxes: vec![
                Rc::new(Inbox {
                    id: String::from("1"),
                    name: String::from("Catch-all"),
                    unread_count: 0,
                }),
                Rc::new(Inbox {
                    id: String::from("2"),
                    name: String::from("Pixelbar"),
                    unread_count: 0,
                }),
                Rc::new(Inbox {
                    id: String::from("3"),
                    name: String::from("Spam"),
                    unread_count: 1000,
                }),
            ],
            ..Default::default()
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::SelectInbox(index) => {
                self.current_inbox = Some(self.inboxes[index].clone());
                true
            }
            Msg::EditInbox(index) => {
                self.current_editing_inbox = Some(self.inboxes[index].clone());
                true
            }
        }
    }
}

impl Renderable<Model> for Model {
    fn view(&self) -> Html<Self> {
        if let Some(inbox) = &self.current_inbox {
            html! {
                <>
                    <InboxList:
                        inboxes=self.inboxes.clone(),
                        onselect=Msg::SelectInbox,
                        current=Some(inbox.clone()),
                    />
                </>
            }
        } else {
            html!{
                <InboxBlocks:
                    inboxes=self.inboxes.clone(),
                    onselect=Msg::SelectInbox,
                />
            }
        }
    }
}

fn main() {
    yew::initialize();
    App::<Model>::new().mount_to_body();
    yew::run_loop();
}
