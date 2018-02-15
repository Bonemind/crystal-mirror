-- !migrate up

ALTER TABLE repositories ADD COLUMN last_polled timestamp;
ALTER TABLE repositories ADD COLUMN poll_interval INTEGER DEFAULT 60 NOT NULL;

-- !migrate down
ALTER TABLE repositories DROP COLUMN last_polled;
ALTER TABLE DROP COLUMN poll_interval;
