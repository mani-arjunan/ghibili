CREATE TABLE public.users (
    mobile_number int NOT NULL,
    id SERIAL UNIQUE,
    name varchar,
    password varchar,
    CONSTRAINT users_pk PRIMARY KEY (mobile_number)
);

