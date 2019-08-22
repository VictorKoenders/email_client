SELECT
    mail.id as id,
    subject.value as subject,
    mail.from,
    mail_to.to,
    mail.received_on,
    mail.unread
FROM mail
LEFT JOIN mail_header AS subject
    ON subject.mail_id = mail.id
    AND subject.key ILIKE 'subject'
INNER JOIN mail_to ON mail_to.mail_id = mail.id
INNER JOIN user_inbox_address
    ON user_inbox_address.address = mail_to.to
    AND user_inbox_address.user_inbox_id = $1
ORDER BY mail.received_on DESC
