-- !migrate up
CREATE TABLE users(
     id BIGSERIAL PRIMARY KEY,
     name character varying NOT NULL,
     password character varying NOT NULL,
     created_at timestamp without time zone,
     updated_at timestamp without time zone
);

INSERT INTO users VALUES (1, 'admin', '$2a$10$7eCAd/IliJux7h8iu/96EucGSUBhzpj3NX/KQ1j6CeXv.7UxAAhNi', NOW(), NOW());

-- !migrate down
DROP TABLE users;
