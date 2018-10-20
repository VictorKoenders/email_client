use actix::{Actor, ArbiterService, AsyncContext, Context, Handler, Recipient, Supervised};
use failure::ResultExt;
use message::Message;
use native_tls::TlsConnector;
use std::env;
use std::str;
use std::time::Duration;
use Result;

pub type Client = ::imap::client::Client<::native_tls::TlsStream<::std::net::TcpStream>>;

#[derive(Clone, Debug, Message)]
pub enum ImapMessage {
    NewMessage(Message),
}

pub struct EmailParser {
    message_recipients: Vec<Recipient<ImapMessage>>,
    pub client: Client,
}

impl Default for EmailParser {
    fn default() -> EmailParser {
        let imap_domain = env::var("IMAP_DOMAIN").expect("Missing env var IMAP_DOMAIN");
        let imap_port: u16 = env::var("IMAP_PORT")
            .expect("Missing env var IMAP_PORT")
            .parse()
            .expect("IMAP_PORT is not a valid unsigned int");
        let imap_host = env::var("IMAP_HOST").expect("Missing env var IMAP_HOST");
        let imap_username = env::var("IMAP_USERNAME").expect("Missing env var IMAP_USERNAME");
        let imap_password = env::var("IMAP_PASSWORD").expect("Missing env var IMAP_PASSWORD");
        let socket_addr = format!("{}:{}", imap_host, imap_port);

        println!(
            "Connecting to {:?} (domain: {:?})",
            socket_addr, imap_domain
        );
        let ssl_connector = TlsConnector::builder()
            .expect("Could not create TLS builder")
            .build()
            .expect("Could not instantiate TLS connection");
        let mut client = Client::secure_connect(socket_addr, &imap_domain, &ssl_connector)
            .expect("Could not create a secure client");

        client.login(&imap_username, &imap_password).unwrap();
        client.select("INBOX").unwrap();

        EmailParser {
            message_recipients: Vec::new(),
            client,
        }
    }
}

impl Actor for EmailParser {
    type Context = Context<Self>;
}

impl Supervised for EmailParser {
    fn restarting(&mut self, _ctx: &mut Self::Context) {
        println!("[EmailParser] Restarting");
        *self = EmailParser::default();
    }
}

impl ArbiterService for EmailParser {
    fn service_started(&mut self, ctx: &mut Context<Self>) {
        println!("[EmailParser] Started");
        ctx.run_interval(Duration::from_secs(2), |parser, _context| {
            parser.update().expect("[MailReader] Can not update");
        });
    }
}

impl Handler<AddListener> for EmailParser {
    type Result = ();
    fn handle(&mut self, msg: AddListener, _context: &mut Self::Context) {
        self.message_recipients.push(msg.0);
    }
}

impl EmailParser {
    fn update(&mut self) -> Result<()> {
        let result = self
            .client
            .run_command_and_read_response("SEARCH UNSEEN")
            .context("Could not execute \"SEARCH UNSEEN\"")?;
        let str = str::from_utf8(&result).context("Could not parse IMAP message as valid utf8")?;

        const SEARCH_PREFIX: &str = "* SEARCH";
        if !str.starts_with(SEARCH_PREFIX) {
            bail!("Expected {:?}, got {:?}", SEARCH_PREFIX, str);
        }
        let newline = str.find("\r\n").unwrap_or_else(|| str.len());
        let keys: Vec<_> = str[SEARCH_PREFIX.len()..newline]
            .trim()
            .split(' ')
            .filter_map(|s| s.parse().ok()) // !s.trim().is_empty())
            .collect();
        if keys.is_empty() {
            return Ok(());
        }
        println!("[MailReader] Parsing IMAP email {:?}", keys);

        for key in keys {
            let messages = Message::read(&mut self.client, key)?;
            for recipient in &self.message_recipients {
                for message in &messages {
                    recipient
                        .do_send(ImapMessage::NewMessage(message.clone()))
                        .expect("Could not send message to recipient");
                }
            }
        }
        Ok(())
    }
}

pub fn reset() {
    let mut parser = EmailParser::default();
    println!(
        "[EmailParser] resetting seen flag: {:?}",
        parser
            .client
            .store("1:*", "-FLAGS \\SEEN")
            .map(|v| v.into_iter().map(|f| f.message).collect::<Vec<_>>())
    );
}

#[derive(Message)]
pub struct AddListener(pub Recipient<ImapMessage>);
