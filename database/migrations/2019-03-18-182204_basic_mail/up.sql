-- Your SQL goes here
CREATE TABLE email (
    id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
    imap_index BIGINT NOT NULL UNIQUE
);

CREATE TABLE email_part (
    id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
    email_id UUID NOT NULL REFERENCES email(id),
    type SMALLINT NOT NULL,
    file_name TEXT NULL,
    body BYTEA NOT NULL
);

ALTER TABLE email ADD COLUMN body_text_id UUID NULL REFERENCES email_part(id);
ALTER TABLE email ADD COLUMN body_html_id UUID NULL REFERENCES email_part(id);

CREATE TABLE email_header (
    id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
    email_id UUID NOT NULL REFERENCES email(id),
    email_part_id UUID NULL REFERENCES email_part (id),
    key TEXT NOT NULL,
    value TEXT NOT NULL
);


