-- This file should undo anything in `up.sql`
ALTER TABLE email DROP COLUMN is_read;

DROP TABLE inbox_pattern;
DROP TABLE inbox;

