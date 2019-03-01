use failure::{format_err, Error};
use futures::Future;
use std::sync::{Arc, Mutex};
use tokio::net::TcpListener;
use tokio::prelude::*;
use tokio_io::codec::Decoder;

mod non_shitty_channel;
mod non_shitty_lines_codec;

pub use crate::non_shitty_channel::*;
pub use crate::non_shitty_lines_codec::LinesCodec;

pub type Result<T> = std::result::Result<T, Error>;

pub struct SmtpServer<T> {
    handler: Arc<Mutex<T>>,
    config: Arc<Config>,
}

#[derive(Default)]
pub struct Config {}

pub trait Handler {
    fn email_received(&mut self, email: Email) -> Result<()>;
}

pub struct Email {}

impl<T> SmtpServer<T>
where
    T: Handler + std::marker::Send + 'static,
{
    pub fn new(handler: T, config: Config) -> SmtpServer<T> {
        SmtpServer {
            handler: Arc::new(Mutex::new(handler)),
            config: Arc::new(config),
        }
    }

    pub fn run(&self) -> Result<()> {
        let result = Arc::new(Mutex::new(Ok(())));
        let inner_result = result.clone();
        tokio::run(self.spawn().map_err(move |e| {
            *inner_result.lock().unwrap() = Err(e);
        }));
        Arc::try_unwrap(result)
            .map_err(|e| format_err!("Could not get an exclusive lock on the result: {:?}", e))?
            .into_inner()
            .map_err(|e| format_err!("Could not get an exclusive lock on the result: {:?}", e))?
    }

    pub fn spawn(&self) -> impl Future<Item = (), Error = failure::Error> {
        let addr = "127.0.0.1:12345".parse().unwrap();
        let listener = TcpListener::bind(&addr).expect("unable to bind TCP listener");

        let handler = self.handler.clone();
        let _config = self.config.clone();
        listener
            .incoming()
            .map_err(|e| format_err!("accept failed = {:?}", e))
            .for_each(move |sock| {
                let _handler = handler
                    .try_lock()
                    .map_err(|e| format_err!("Could not get a handler: {:?}", e))?;
                let addr = sock.peer_addr().unwrap();
                println!("Received sock {:?}", addr);
                let sock = LinesCodec::new().framed(sock);
                let (sender, receiver) = channel();
                let (sink, stream) = sock.split();
                tokio::spawn(
                    sink.send_all(receiver)
                        .map(|_| ())
                        .map_err(|e| println!("Could not sink to client: {:?}", e)),
                );
                sender.send(String::from(
                    "220 ip-172-26-1-82.eu-central-1.compute.internal ESMTP Postfix",
                ));
                tokio::spawn(
                    stream
                        .for_each(move |msg| {
                            println!("Client {:?} send {:?}", addr, msg);
                            if msg == "EHLO [127.0.0.1]" {
                                for command in &[
                                    "250-ip-172-26-1-82.eu-central-1.compute.internal",
                                    "250-PIPELINING",
                                    "250-SIZE 204800000",
                                    "250-VRFY",
                                    "250-ETRN",
                                    "250-STARTTLS",
                                    "250-ENHANCEDSTATUSCODES",
                                    "250-8BITMIME",
                                    "250-DSN",
                                    "250 SMTPUTF8",
                                ] {
                                    sender.send(command.to_string());
                                }
                            }
                            if msg == "STARTTLS" {
                                sender.send(String::from("220 2.0.0 Ready to start TLS"));
                            }
                            Ok(())
                        })
                        .map_err(move |e| {
                            eprintln!("Client {:?} encountered an error: {:?}", addr, e);
                        }),
                );
                Ok(())
            })
    }
}
