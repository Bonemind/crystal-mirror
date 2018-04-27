-- !migrate up
CREATE TABLE commandresults (
   id BIGSERIAL PRIMARY KEY,
   output TEXT NOT NULL,
   status INTEGER NOT NULL,
   repository_id BIGINT REFERENCES repositories(id),
   created_at timestamp without time zone,
   updated_at timestamp without time zone
);

-- !migrate down
DROP TABLE commandresults;
