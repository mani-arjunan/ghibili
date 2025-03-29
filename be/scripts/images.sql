CREATE TABLE public.images (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    image BYTEA NOT NULL, -- stores binary image data
    status VARCHAR(50) NOT NULL
);

