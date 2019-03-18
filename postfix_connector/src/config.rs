macro_rules! get_env {
    ($name:tt) => {
        std::env::var(stringify!($name)).expect(concat!("Missing env var ", stringify!($name)))
    };
    ($name:tt as $ty:ty) => {
        std::env::var(stringify!($name))
            .expect(concat!("Missing env var ", stringify!($name)))
            .parse::<$ty>()
            .expect(concat!(stringify!($name), " is not a valid value"))
    };
}

pub struct Config {
    pub imap: ImapConfig,
    pub smtp: SmtpConfig,
    pub database_url: String,
}

impl Default for Config {
    fn default() -> Config {
        Config {
            imap: ImapConfig::default(),
            smtp: SmtpConfig::default(),
            database_url: get_env!(DATABASE_URL),
        }
    }
}

pub struct ImapConfig {
    pub domain: String,
    pub port: u16,
    pub host: String,
    pub username: String,
    pub password: String,
}

impl Default for ImapConfig {
    fn default() -> ImapConfig {
        ImapConfig {
            domain: get_env!(IMAP_DOMAIN),
            port: get_env!(IMAP_PORT as u16),
            host: get_env!(IMAP_HOST),
            username: get_env!(IMAP_USERNAME),
            password: get_env!(IMAP_PASSWORD),
        }
    }
}

pub struct SmtpConfig {
    pub domain: String,
    pub port: u16,
    pub host: String,
    pub username: String,
    pub password: String,
}

impl Default for SmtpConfig {
    fn default() -> SmtpConfig {
        SmtpConfig {
            domain: get_env!(SMTP_DOMAIN),
            port: get_env!(SMTP_PORT as u16),
            host: get_env!(SMTP_HOST),
            username: get_env!(SMTP_USERNAME),
            password: get_env!(SMTP_PASSWORD),
        }
    }
}
