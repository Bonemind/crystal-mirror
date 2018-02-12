-- !migrate up
CREATE TABLE users(
     id BIGSERIAL PRIMARY KEY,
     name character varying NOT NULL,
     password character varying NOT NULL,
     created_at timestamp without time zone,
     updated_at timestamp without time zone
);

-- !migrate down
DROP TABLE users;
