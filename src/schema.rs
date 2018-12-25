table! {
    email (id) {
        id -> Uuid,
        inbox_id -> Uuid,
        created_on -> Timestamptz,
        imap_index -> Int4,
        from -> Nullable<Text>,
        to -> Nullable<Text>,
        subject -> Nullable<Text>,
        text_plain_body -> Nullable<Text>,
        html_body -> Nullable<Text>,
        html_body_raw -> Nullable<Text>,
        raw -> Bytea,
        read -> Bool,
    }
}

table! {
    email_attachment (id) {
        id -> Uuid,
        email_id -> Uuid,
        mime_type -> Text,
        name -> Nullable<Text>,
        content_id -> Nullable<Text>,
        contents -> Bytea,
    }
}

table! {
    email_attachment_header (email_attachment_id, key) {
        email_attachment_id -> Uuid,
        key -> Text,
        value -> Text,
    }
}

table! {
    email_header (email_id, key) {
        email_id -> Uuid,
        key -> Text,
        value -> Text,
    }
}

table! {
    inbox (id) {
        id -> Uuid,
        name -> Text,
    }
}

table! {
    inbox_address (inbox_id, address) {
        inbox_id -> Uuid,
        address -> Text,
    }
}

joinable!(email -> inbox (inbox_id));
joinable!(email_attachment -> email (email_id));
joinable!(email_attachment_header -> email_attachment (email_attachment_id));
joinable!(email_header -> email (email_id));
joinable!(inbox_address -> inbox (inbox_id));

allow_tables_to_appear_in_same_query!(
    email,
    email_attachment,
    email_attachment_header,
    email_header,
    inbox,
    inbox_address,
);
