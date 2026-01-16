CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE user_skills (
    skill_id INT NOT NULL REFERENCES skills(id) ON DELETE CASCADE ,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE ,
    skill_level INT NOT NULL DEFAULT 0 CHECK (skill_level BETWEEN 0 AND 3),
    PRIMARY KEY (user_id, skill_id)
);

CREATE TYPE project_status AS ENUM (
    'IN_PROGRESS',
    'COMPLETED'
    );

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    project_status project_status DEFAULT 'IN_PROGRESS'
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

CREATE INDEX idx_team_users_user_team ON team_users(user_id, team_id);
CREATE INDEX idx_project_teams_team_project ON project_teams(team_id, project_id);

