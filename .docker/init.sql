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

-- P@ssw0rd!11
INSERT INTO "movie_api".account (email, password, type, username) VALUES ('nscode@example.com','5fcf70788bcc10dccc8ecea9a1c02b06f745e07d5a7355af1b282fc4692a859e',1,'nscode');

CREATE TABLE "movie_api".token (
    id TEXT CONSTRAINT token_pk PRIMARY KEY,
    user_id INTEGER CONSTRAINT token_user_id_key UNIQUE
);


ALTER TABLE "movie_api".token OWNER TO nscode;


CREATE TABLE "movie_api".movie (
    id SERIAL NOT NULL CONSTRAINT movie_pk PRIMARY KEY,
    user_id INTEGER,
    title TEXT,
    released TEXT,
    genre TEXT,
    director TEXT
);

ALTER TABLE "movie_api".movie OWNER TO nscode;


CREATE TABLE "movie_api".session_track (
    id SERIAL NOT NULL CONSTRAINT session_track_pk PRIMARY KEY,
    user_id INTEGER,
    date TIMESTAMP DEFAULT NOW()
);

ALTER TABLE "movie_api".session_track OWNER TO nscode;