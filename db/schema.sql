CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE team_users (
    team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (team_id, user_id)
);

CREATE TABLE project_teams (
    project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, team_id)
);

CREATE TABLE user_roles (
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Seed data
INSERT INTO users (email, name, password_hash)
VALUES ('alice@gmail.com','alice','$2a$14$FgBK1IXswfemEaj2DV/MtuX4PkuNHpqEXTvaCDhDqH6ODYQvigw2q')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, name, password_hash)
VALUES ('bob@gmail.com','bob','$2a$14$FgBK1IXswfemEaj2DV/MtuX4PkuNHpqEXTvaCDhDqH6ODYQvigw2q')
ON CONFLICT (email) DO NOTHING;

INSERT INTO roles (name) VALUES ('USER') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('ADMIN') ON CONFLICT (name) DO NOTHING;

-- Teams
INSERT INTO teams (name)
SELECT 'Platform' WHERE NOT EXISTS (SELECT 1 FROM teams WHERE name = 'Platform');
INSERT INTO teams (name)
SELECT 'Delivery' WHERE NOT EXISTS (SELECT 1 FROM teams WHERE name = 'Delivery');
INSERT INTO teams (name)
SELECT 'Data' WHERE NOT EXISTS (SELECT 1 FROM teams WHERE name = 'Data');

INSERT INTO projects (name)
SELECT 'Engine Rewrite' WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Engine Rewrite');
INSERT INTO projects (name)
SELECT 'Customer Portal' WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Customer Portal');

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = 'ADMIN'
WHERE u.email = 'alice@gmail.com'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = 'USER'
WHERE u.email = 'bob@gmail.com'
ON CONFLICT DO NOTHING;

INSERT INTO team_users (team_id, user_id)
SELECT t.id, u.id
FROM teams t
JOIN users u ON u.email = 'alice@gmail.com'
WHERE t.name IN ('Platform', 'Data')
ON CONFLICT DO NOTHING;

INSERT INTO team_users (team_id, user_id)
SELECT t.id, u.id
FROM teams t
JOIN users u ON u.email = 'bob@gmail.com'
WHERE t.name IN ('Delivery')
ON CONFLICT DO NOTHING;

INSERT INTO project_teams (project_id, team_id)
SELECT p.id, t.id
FROM projects p
JOIN teams t ON t.name IN ('Platform', 'Delivery')
WHERE p.name = 'Engine Rewrite'
ON CONFLICT DO NOTHING;

INSERT INTO project_teams (project_id, team_id)
SELECT p.id, t.id
FROM projects p
JOIN teams t ON t.name IN ('Data', 'Delivery')
WHERE p.name = 'Customer Portal'
ON CONFLICT DO NOTHING;

