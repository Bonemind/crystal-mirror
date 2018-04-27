-- !migrate up
ALTER TABLE repositories DROP COLUMN last_polled;

-- !migrate down
ALTER TABLE repositories ADD COLUMN last_polled timestamp;
