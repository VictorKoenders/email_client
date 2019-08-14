table! {
    mail (id) {
        id -> Uuid,
        remote_addr -> Text,
        ssl -> Bool,
        from -> Text,
        received_on -> Timestamptz,
        unread -> Bool,
    }
}

table! {
    mail_header (id) {
        id -> Uuid,
        mail_part_id -> Nullable<Uuid>,
        mail_id -> Uuid,
        key -> Text,
        value -> Text,
    }
}

table! {
    mail_part (id) {
        id -> Uuid,
        parent_part_id -> Nullable<Uuid>,
        mail_id -> Uuid,
        body -> Bytea,
    }
}

table! {
    mail_to (id) {
        id -> Uuid,
        mail_id -> Uuid,
        to -> Text,
    }
}

table! {
    user (id) {
        id -> Uuid,
        name -> Text,
        password -> Text,
        auth_token -> Nullable<Uuid>,
    }
}

table! {
    user_inbox (id) {
        id -> Uuid,
        user_id -> Uuid,
        name -> Text,
    }
}

table! {
    user_inbox_address (id) {
        id -> Uuid,
        user_inbox_id -> Uuid,
        address -> Text,
    }
}

joinable!(mail_header -> mail (mail_id));
joinable!(mail_header -> mail_part (mail_part_id));
joinable!(mail_part -> mail (mail_id));
joinable!(mail_to -> mail (mail_id));
joinable!(user_inbox -> user (user_id));
joinable!(user_inbox_address -> user_inbox (user_inbox_id));

allow_tables_to_appear_in_same_query!(
    mail,
    mail_header,
    mail_part,
    mail_to,
    user,
    user_inbox,
    user_inbox_address,
);
