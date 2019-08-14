SELECT
    uuid_nil() AS id,
    '' AS name,
    (
        SELECT COUNT(*)
        FROM mail
        INNER JOIN mail_to ON mail_to.mail_id = mail.id
        WHERE mail.unread = true
        AND NOT EXISTS (SELECT * FROM user_inbox_address WHERE user_inbox_address.address = mail_to.to)
    ) as unread_count
UNION
SELECT
    user_inbox.id,
    user_inbox.name,
    (
        SELECT COUNT(*)
        FROM user_inbox_address
        INNER JOIN mail_to ON mail_to.to = user_inbox_address.address
        INNER JOIN mail ON mail.id = mail_to.mail_id
        WHERE user_inbox_address.user_inbox_id = user_inbox.id
        AND mail.unread = true
    ) as unread_count
FROM user_inbox