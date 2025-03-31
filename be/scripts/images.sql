CREATE TABLE public.images (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    image_urk VARCHAR(1000) NOT NULL,
    status VARCHAR(50) NOT NULL
);

