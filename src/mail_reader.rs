use actix::{Actor, ArbiterService, AsyncContext, Context, Handler, Recipient, Supervised};
use failure::ResultExt;
use message::Message;
use native_tls::{Pkcs12, TlsConnector};
use std::env;
use std::fs::File;
use std::io::Read;
use std::str;
use std::time::Duration;
use Result;

pub type Client = ::imap::client::Client<::native_tls::TlsStream<::std::net::TcpStream>>;

#[derive(Clone, Debug, Message)]
pub enum ImapMessage {
    NewMessage(Message),
}

pub struct EmailParser {
    imap_domain: String,
    imap_port: u16,
    imap_host: String,
    imap_pfx_file: String,
    imap_pfx_file_password: String,
    imap_username: String,
    imap_password: String,

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
        let imap_pfx_file = env::var("IMAP_PFX_FILE").expect("Missing env var IMAP_PFX_FILE");
        let imap_pfx_file_password =
            env::var("IMAP_PFX_FILE_PASSWORD").expect("Missing env var IMAP_PFX_FILE_PASSWORD");
        let imap_username = env::var("IMAP_USERNAME").expect("Missing env var IMAP_USERNAME");
        let imap_password = env::var("IMAP_PASSWORD").expect("Missing env var IMAP_PASSWORD");
        let socket_addr = format!("{}:{}", imap_host, imap_port);

        let mut file = File::open(&imap_pfx_file)
            .unwrap_or_else(|e| panic!("Could not open file {:?}: {}", imap_pfx_file, e));
        let mut identity = vec![];
        file.read_to_end(&mut identity)
            .expect("Could not read pfx file");
        let identity = Pkcs12::from_der(&identity, &imap_pfx_file_password)
            .expect("Could not parse pfx file as PKCS12");
        let mut ssl_connector = TlsConnector::builder().expect("Could not create TLS builder");
        ssl_connector
            .identity(identity)
            .expect("Could not load TLS identity");
        let ssl_connector = ssl_connector
            .build()
            .expect("Could not instantiate TLS connection");
        let mut client = Client::secure_connect(socket_addr, &imap_domain, &ssl_connector)
            .expect("Could not create a secure client");

        client.login(&imap_username, &imap_password).unwrap();
        client.select("INBOX").unwrap();

        EmailParser {
            imap_domain,
            imap_port,
            imap_host,
            imap_pfx_file,
            imap_pfx_file_password,
            imap_username,
            imap_password,
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
        let socket_addr = format!("{}:{}", self.imap_host, self.imap_port);
        let mut file = File::open(&self.imap_pfx_file)
            .unwrap_or_else(|e| panic!("Could not open file {:?}: {}", self.imap_pfx_file, e));
        let mut identity = vec![];
        file.read_to_end(&mut identity)
            .expect("Could not read pfx file");
        let identity = Pkcs12::from_der(&identity, &self.imap_pfx_file_password)
            .expect("Could not parse pfx file as PKCS12");
        let mut ssl_connector = TlsConnector::builder().expect("Could not create TLS builder");
        ssl_connector
            .identity(identity)
            .expect("Could not load TLS identity");
        let ssl_connector = ssl_connector
            .build()
            .expect("Could not instantiate TLS connection");
        let mut client = Client::secure_connect(socket_addr, &self.imap_domain, &ssl_connector)
            .expect("Could not create a secure client");
        client
            .login(&self.imap_username, &self.imap_password)
            .unwrap();
        self.client = client;
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

        for key in keys.into_iter().rev() {
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
