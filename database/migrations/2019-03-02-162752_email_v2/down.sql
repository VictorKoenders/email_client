-- This file should undo anything in `up.sql`
DROP TABLE email_header_2;

ALTER TABLE email_2 DROP COLUMN body_text_id;
ALTER TABLE email_2 DROP COLUMN body_html_id;

DROP TABLE email_part;
DROP TABLE email_2;

