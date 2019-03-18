-- Your SQL goes here
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE request_logs (
    id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
    url TEXT NOT NULL,
    headers TEXT NOT NULL,
    response_code INT NULL,
    response_size_bytes INT NULL,
    created_on TIMESTAMPTZ NOT NULL,
    finished_on TIMESTAMPTZ NULL
);

CREATE TABLE users (
    id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
    register_request_id UUID NOT NULL REFERENCES request_logs(id),
    name TEXT NOT NULL,
    login_name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    email_confirmed_request_id UUID NULL REFERENCES request_logs(id)
);

CREATE TABLE user_tokens (
    id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
    user_id UUID NOT NULL REFERENCES users(id),
    created_on TIMESTAMPTZ NOT NULL,
    created_request_id UUID NOT NULL REFERENCES request_logs(id),
    ip TEXT NOT NULL
);
