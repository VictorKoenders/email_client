SELECT
    mail.id,
    subject.value as subject,
    mail.from,
    mail_to.to,
    mail.received_on,
    mail.unread
FROM mail
LEFT JOIN mail_header AS subject
    ON subject.mail_id = mail.id
    AND subject.key ILIKE 'subject'
INNER JOIN mail_to
    ON mail_to.mail_id = mail.id
    AND NOT EXISTS(
        SELECT *
        FROM user_inbox_address
        WHERE user_inbox_address.address = mail_to.to
    )
ORDER BY mail.received_on DESC
