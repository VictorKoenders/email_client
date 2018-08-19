table! {
    address (id) {
        id -> Uuid,
        short_name -> Text,
        email_address -> Text,
    }
}

table! {
    email (id) {
        id -> Uuid,
        address_id -> Uuid,
        created_on -> Timestamp,
        from -> Nullable<Text>,
        to -> Nullable<Text>,
        subject -> Nullable<Text>,
        body -> Nullable<Text>,
        raw -> Text,
        read -> Bool,
    }
}

table! {
    emailheader (email_id, key) {
        email_id -> Uuid,
        key -> Text,
        value -> Text,
    }
}

joinable!(email -> address (address_id));
joinable!(emailheader -> email (email_id));

allow_tables_to_appear_in_same_query!(address, email, emailheader,);
