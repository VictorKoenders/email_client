use bincode;
use crate::{Model, Msg};
use failure::Error;
use serde::{Deserialize, Serialize};
use shared::email::{EmailHeader, LoadEmailRequest};
use shared::inbox::{Inbox, LoadInboxRequest};
use shared::login::LoginRequest;
use shared::{ClientToServer, ServerToClient, CLIENT_TO_SERVER_VERSION};
use std::fmt;
use stdweb::web::document;
use yew::prelude::*;
use yew::services::websocket::*;

pub struct Send<T>(pub T);

impl<T: Serialize> Into<Result<Vec<u8>, Error>> for Send<T> {
    fn into(self) -> Result<Vec<u8>, Error> {
        bincode::serialize(&self.0).map_err(Into::into)
    }
}

#[derive(Debug)]
pub struct DataResult<T: fmt::Debug>(pub Result<T, Error>);

impl<T: for<'a> Deserialize<'a> + fmt::Debug> DataResult<T> {
    pub fn from_bytes(b: &[u8]) -> Result<T, Error> {
        bincode::deserialize(b).map_err(Into::into)
    }
}

impl<T: for<'a> Deserialize<'a> + fmt::Debug> From<Result<String, Error>> for DataResult<T> {
    fn from(r: Result<String, Error>) -> DataResult<T> {
        match r {
            Ok(s) => DataResult(DataResult::from_bytes(s.as_bytes())),
            Err(e) => DataResult(Err(e)),
        }
    }
}

impl<T: for<'a> Deserialize<'a> + fmt::Debug> From<Result<Vec<u8>, Error>> for DataResult<T> {
    fn from(r: Result<Vec<u8>, Error>) -> DataResult<T> {
        match r {
            Ok(v) => DataResult(DataResult::from_bytes(&v)),
            Err(e) => DataResult(Err(e)),
        }
    }
}

pub struct Network {
    service: WebSocketService,
    task: Option<WebSocketTask>,
    connect_callback: Callback<WebSocketStatus>,
    data_callback: Callback<DataResult<ServerToClient>>,
}

impl Network {
    pub fn create(link: &mut ComponentLink<Model>) -> Self {
        let service = WebSocketService::new();
        let connect_callback = link.send_back(Msg::NetworkStatusChanged);
        let data_callback = link.send_back(Msg::DataReceived);

        let mut network = Network {
            service,
            task: None,
            connect_callback,
            data_callback,
        };
        network.reconnect();
        network
    }

    pub fn disconnect(&mut self) {
        self.task = None;
    }

    pub fn reconnect(&mut self) {
        let location = document().location().unwrap();
        let path = format!("ws://{}:8001/ws/", location.hostname().unwrap());
        self.task = Some(self.service.connect(
            &path,
            self.data_callback.clone(),
            self.connect_callback.clone(),
        ));
    }

    pub fn load_inboxes(&mut self) {
        if let Some(task) = &mut self.task {
            task.send_binary(Send(CLIENT_TO_SERVER_VERSION));
        }
    }

    pub fn load_inbox(&mut self, inbox: &Inbox) {
        if let Some(task) = &mut self.task {
            task.send_binary(Send(ClientToServer::LoadInbox(
                LoadInboxRequest { id: inbox.id }.into(),
            )));
        }
    }

    pub fn attempt_login(&mut self, request: LoginRequest) {
        if let Some(task) = &mut self.task {
            task.send_binary(Send(ClientToServer::Authenticate(request.into())));
        }
    }

    pub fn load_email(&mut self, email: &EmailHeader) {
        if let Some(task) = &mut self.task {
            task.send_binary(Send(ClientToServer::LoadEmail(
                LoadEmailRequest { id: email.id }.into(),
            )));
        }
    }
}
