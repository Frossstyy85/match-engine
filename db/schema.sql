CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE teams (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL UNIQUE
-- );
--
-- CREATE TABLE user_teams (
--     user_id INT NOT NULL,
--     team_id INT NOT NULL,
--     PRIMARY KEY (user_id, team_id),
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
--     FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
-- );