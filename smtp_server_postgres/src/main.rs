fn main() {
    let config = smtp_server_core::Config::default();
    let handler = Handler::default();
    let server = smtp_server_core::SmtpServer::new(handler, config);
    println!("{:?}", server.run());
}

#[derive(Default)]
struct Handler {}

impl smtp_server_core::Handler for Handler {
    fn email_received(&mut self, email: smtp_server_core::Email) -> smtp_server_core::Result<()> {
        println!("Email received");
        Ok(())
    }
}
