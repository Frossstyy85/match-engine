CREATE TYPE user_role AS ENUM ('admin', 'HR', 'employee', 'project_lead');

CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       password TEXT NOT NULL,
                       role user_role NOT NULL DEFAULT 'employee',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
