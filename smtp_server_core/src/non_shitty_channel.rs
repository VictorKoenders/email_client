use futures::prelude::*;
use futures::sync::mpsc::{
    channel as shitty_channel, Receiver as ShittyReceiver, Sender as ShittySender,
};
use futures::Async;

pub fn channel<T>() -> (Sender<T>, Receiver<T>) {
    let (shitty_sender, shitty_receiver) = shitty_channel(100);
    (Sender { shitty_sender }, Receiver { shitty_receiver })
}

pub struct Sender<T> {
    shitty_sender: ShittySender<T>,
}

impl<T: std::marker::Send + 'static> Sender<T> {
    pub fn send(&self, item: T) {
        tokio::spawn(
            self.shitty_sender
                .clone()
                .send(item)
                .map(|_| ())
                .map_err(|_| ()),
        );
    }
}

pub struct Receiver<T> {
    shitty_receiver: ShittyReceiver<T>,
}

impl<T> futures::Stream for Receiver<T> {
    type Error = std::io::Error;
    type Item = T;

    fn poll(&mut self) -> futures::Poll<Option<Self::Item>, Self::Error> {
        match self.shitty_receiver.poll() {
            Ok(Async::Ready(Some(t))) => Ok(Async::Ready(Some(t))),
            Ok(Async::Ready(None)) => Ok(Async::Ready(None)),
            Ok(Async::NotReady) => Ok(Async::NotReady),
            Err(()) => Err(std::io::Error::last_os_error()),
        }
    }
}
