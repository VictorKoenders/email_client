-- Your SQL goes here
ALTER TABLE email ADD COLUMN is_read BOOL NOT NULL DEFAULT (false);

CREATE TABLE inbox (
    id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
    name TEXT NOT NULL
);

CREATE TABLE inbox_pattern (
    id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
    inbox_id UUID NOT NULL REFERENCES inbox(id),
    pattern TEXT NOT NULL
);

