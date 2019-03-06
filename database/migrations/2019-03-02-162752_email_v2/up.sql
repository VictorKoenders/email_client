-- Your SQL goes here
CREATE TABLE email_2 (
    id UUID PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
    imap_index BIGINT NOT NULL UNIQUE
);

CREATE TABLE email_part (
    id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
    email_id UUID NOT NULL REFERENCES email_2(id)
);

ALTER TABLE email_2 ADD COLUMN body_text_id UUID REFERENCES email_part(id);
ALTER TABLE email_2 ADD COLUMN body_html_id UUID REFERENCES email_part(id);

CREATE TABLE email_header_2 (
    id UUID PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
    email_id UUID REFERENCES email_2(id),
    email_part_id UUID REFERENCES email_part(id),
    key TEXT NOT NULL,
    value TEXT NOT NULL
);
