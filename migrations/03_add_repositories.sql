-- !migrate up
CREATE TABLE repositories (
   id BIGSERIAL PRIMARY KEY,
   from_url CHARACTER VARYING NOT NULL,
   to_url CHARACTER VARYING NOT NULL,
   user_id BIGINT REFERENCES users (id),
   created_at timestamp without time zone,
   updated_at timestamp without time zone
);

-- !migrate down
DROP TABLE repositories;
