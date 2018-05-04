-- !migrate up
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

UPDATE users SET is_admin=TRUE WHERE id=1;

-- !migrate down
ALTER TABLE users DROP COLUMN is_admin;
