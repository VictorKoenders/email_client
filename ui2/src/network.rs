use crate::Model;
use yew::prelude::*;
use yew::services::websocket::*;

pub struct Network {
    service: WebSocketService,
    task: WebSocketTask,
}

impl Component for Network {

}

impl Network {
    pub fn new() -> Self {
        let service = WebSocketService::new();
//        let connect_callback = 
        let task = service.connect("/ws", )
        Network { service }
    }

    pub fn load_inboxes(&mut self, root: &Model) {}
}
