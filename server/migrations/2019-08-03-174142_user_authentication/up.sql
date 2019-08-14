-- Your SQL goes here
CREATE TABLE "user" (
    id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
    name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE user_inbox (
    id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
    user_id UUID NOT NULL REFERENCES "user"(id),
    name TEXT NOT NULL
);

CREATE TABLE user_inbox_address (
    id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
    user_inbox_id UUID NOT NULL REFERENCES user_inbox(id),
    address TEXT NOT NULL
);
