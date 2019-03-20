table! {
    use diesel::sql_types::*;
    use crate::email_part::{EmailPartType as Emailparttype};

    email (id) {
        id -> Uuid,
        imap_index -> Int8,
        body_text_id -> Nullable<Uuid>,
        body_html_id -> Nullable<Uuid>,
        is_read -> Bool,
    }
}

table! {
    use diesel::sql_types::*;
    use crate::email_part::{EmailPartType as Emailparttype};

    email_header (id) {
        id -> Uuid,
        email_id -> Uuid,
        email_part_id -> Nullable<Uuid>,
        key -> Text,
        value -> Text,
    }
}

table! {
    use diesel::sql_types::*;
    use crate::email_part::{EmailPartType as Emailparttype};

    email_part (id) {
        id -> Uuid,
        email_id -> Uuid,
        #[sql_name = "type"]
        type_ -> Int2,
        file_name -> Nullable<Text>,
        body -> Bytea,
    }
}

table! {
    use diesel::sql_types::*;
    use crate::email_part::{EmailPartType as Emailparttype};

    inbox (id) {
        id -> Uuid,
        name -> Text,
    }
}

table! {
    use diesel::sql_types::*;
    use crate::email_part::{EmailPartType as Emailparttype};

    inbox_pattern (id) {
        id -> Uuid,
        inbox_id -> Uuid,
        pattern -> Text,
    }
}

table! {
    use diesel::sql_types::*;
    use crate::email_part::{EmailPartType as Emailparttype};

    request_logs (id) {
        id -> Uuid,
        url -> Text,
        headers -> Text,
        response_code -> Nullable<Int4>,
        response_size_bytes -> Nullable<Int4>,
        created_on -> Timestamptz,
        finished_on -> Nullable<Timestamptz>,
    }
}

table! {
    use diesel::sql_types::*;
    use crate::email_part::{EmailPartType as Emailparttype};

    users (id) {
        id -> Uuid,
        register_request_id -> Uuid,
        name -> Text,
        login_name -> Text,
        password -> Text,
        email -> Text,
        email_confirmed_request_id -> Nullable<Uuid>,
    }
}

table! {
    use diesel::sql_types::*;
    use crate::email_part::{EmailPartType as Emailparttype};

    user_tokens (id) {
        id -> Uuid,
        user_id -> Uuid,
        created_on -> Timestamptz,
        created_request_id -> Uuid,
        ip -> Text,
    }
}

joinable!(email_header -> email (email_id));
joinable!(email_header -> email_part (email_part_id));
joinable!(inbox_pattern -> inbox (inbox_id));
joinable!(user_tokens -> request_logs (created_request_id));
joinable!(user_tokens -> users (user_id));

allow_tables_to_appear_in_same_query!(
    email,
    email_header,
    email_part,
    inbox,
    inbox_pattern,
    request_logs,
    users,
    user_tokens,
);
