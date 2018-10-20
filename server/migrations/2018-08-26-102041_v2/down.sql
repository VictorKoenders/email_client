DROP TABLE email_attachment_header;
DROP TABLE email_attachment;
DROP TABLE email_header;
DROP TABLE email;
DROP TABLE inbox_address;
DROP TABLE inbox;

CREATE TABLE Address (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v1(),
    short_name TEXT NOT NULL UNIQUE,
    email_address TEXT NOT NULL UNIQUE
);

CREATE TABLE Email (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v1(),
    address_id UUID NOT NULL REFERENCES Address(id),
    created_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    "from" TEXT NULL,
    "to" TEXT NULL,
    subject TEXT NULL,
    body TEXT NULL,
    raw BYTEA NOT NULL,
    read Boolean NOT NULL DEFAULT (false)
);

CREATE TABLE EmailHeader (
    email_id UUID NOT NULL REFERENCES Email(id),
    key TEXT NOT NULL,
    value TEXT NOT NULL,

    PRIMARY KEY(email_id, key)
);
