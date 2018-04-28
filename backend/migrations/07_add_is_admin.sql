-- !migrate up
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- !migrate down
ALTER TABLE users DROP COLUMN is_admin;
