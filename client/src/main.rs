#[macro_use]
extern crate yew;
#[macro_use]
extern crate serde_derive;

mod network;
mod ui;

use crate::network::*;
use crate::ui::inbox_blocks::InboxBlocks;
use crate::ui::inbox_list::InboxList;
use std::rc::Rc;
use std::time::Duration;
use yew::prelude::*;
use yew::services::console::ConsoleService;
use yew::services::timeout::*;
use yew::services::websocket::*;

pub struct Model {
    pub network: Network,
    pub reconnect_callback: Callback<()>,
    pub reconnect_timeout: Option<TimeoutTask>,
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
    Reconnect,
    Connected(WebSocketStatus),
    DataReceived(DataResult<ServerToClient>),
}

impl Component for Model {
    type Message = Msg;
    type Properties = ();

    fn create(_: Self::Properties, mut link: ComponentLink<Self>) -> Self {
        Model {
            network: Network::create(&mut link),
            reconnect_callback: link.send_back(|_| Msg::Reconnect),
            reconnect_timeout: None,
            console: ConsoleService::new(),
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
            current_inbox: None,
            current_editing_inbox: None,
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
            Msg::Reconnect => {
                self.reconnect_timeout = None;
                self.network.reconnect();
                false
            }
            Msg::Connected(state) => {
                ConsoleService::new().log(&format!("Connected: {:?}", state));
                if let WebSocketStatus::Opened = state {
                    self.network.load_inboxes();
                } else {
                    self.disconnect_and_reconnect_network();
                }
                false
            }
            Msg::DataReceived(DataResult(Ok(msg))) => {
                ConsoleService::new().log(&format!("Received data from server: {:?}", msg));
                true
            }
            Msg::DataReceived(DataResult(Err(e))) => {
                ConsoleService::new().error(&format!("Connection to server failed: {:?}", e));
                self.disconnect_and_reconnect_network();
                false
            }
        }
    }
}

impl Model {
    fn disconnect_and_reconnect_network(&mut self) {
        self.network.disconnect();
        let task =
            TimeoutService::new().spawn(Duration::from_secs(5), self.reconnect_callback.clone());
        self.reconnect_timeout = Some(task);
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
