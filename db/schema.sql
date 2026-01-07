CREATE TYPE user_role AS ENUM (
  'ADMIN',
  'HR',
  'PROJECT_MANAGER',
  'USER'
);

CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       role user_role NOT NULL DEFAULT 'USER',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teams (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO teams (name) VALUES
                             ('Team Alpha'),
                             ('Team Beta');

INSERT INTO users (name, email, password_hash, role) VALUES
                                                         ('Alice', 'alice@gmail.com', '$2b$10$uWlZ9KX2G.k0Y9Y6a9H8kOWoHb8g3cqXf5pXq8F5f1c/7dY4R5c9K', 'ADMIN'),
                                                         ('Jake', 'jake@gmail.com', '$2b$10$uWlZ9KX2G.k0Y9Y6a9H8kOWoHb8g3cqXf5pXq8F5f1c/7dY4R5c9K', 'USER');
