-- !migrate up
CREATE TABLE tokens (
   id BIGSERIAL PRIMARY KEY,
   uuid CHARACTER varying NOT NULL,
   user_id BIGINT REFERENCES users (id),
   created_at timestamp without time zone,
   updated_at timestamp without time zone
);

CREATE UNIQUE INDEX unique_tokens ON tokens(uuid);

-- !migrate down
DROP TABLE tokens;
