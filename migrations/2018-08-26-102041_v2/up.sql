DROP TABLE EmailHeader;
DROP TABLE Email;
DROP TABLE Address;

CREATE TABLE inbox (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE inbox_address (
    inbox_id UUID NOT NULL REFERENCES inbox(id),
    address TEXT NOT NULL,

    PRIMARY KEY (inbox_id, address)
);

INSERT INTO inbox VALUES ('00000000-0000-0000-0000-000000000000', 'Catch-all' );
INSERT INTO inbox_address VALUES ('00000000-0000-0000-0000-000000000000', '*@trangar.com' );

CREATE TABLE email (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    inbox_id UUID NOT NULL REFERENCES inbox(id),
    imap_index INTEGER NOT NULL UNIQUE,
    "from" TEXT NULL,
    "to" TEXT NULL,
    subject TEXT NULL,
    text_plain_body TEXT NULL,
    html_body TEXT NULL,
    raw BYTEA NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE email_header (
    email_id UUID NOT NULL REFERENCES email(id),
    key TEXT NOT NULL,
    value TEXT NOT NULL,

    PRIMARY KEY(email_id, key)
);

CREATE TABLE email_attachment (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_id UUID NOT NULL REFERENCES email(id),
    mime_type TEXT NOT NULL,
    name TEXT NULL,
    content_id TEXT NULL,
    contents BYTEA NOT NULL
);

CREATE TABLE email_attachment_header (
    email_attachment_id UUID NOT NULL REFERENCES email_attachment(id),
    key TEXT NOT NULL,
    value TEXT NOT NULL,

    PRIMARY KEY(email_attachment_id, key)
);
