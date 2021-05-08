CREATE SCHEMA "movie_api";

ALTER SCHEMA "movie_api" OWNER TO nscode;


CREATE TABLE "movie_api".account (
    id SERIAL NOT NULL CONSTRAINT account_pk PRIMARY KEY,
    email TEXT CONSTRAINT account_email_key UNIQUE,
    password TEXT,
    type SMALLINT DEFAULT 0,
    username TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


ALTER TABLE "movie_api".account OWNER TO nscode;
