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

INSERT INTO roles (name) VALUES
                             ('ADMIN'),
                             ('USER'),
                             ('HR'),
                             ('PROJECT_LEAD');

INSERT INTO users (name, email, password_hash, role_id) VALUES
                                                            ('Alice', 'alice@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 1),
                                                            ('Bob', 'bob@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 2),
                                                            ('Carol', 'carol@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 3),
                                                            ('Dave', 'dave@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 4),
                                                            ('Eve', 'eve@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 2),
                                                            ('Frank', 'frank@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 2),
                                                            ('Grace', 'grace@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 3);

INSERT INTO teams (name) VALUES
                             ('Team Alpha'),
                             ('Team Beta'),
                             ('Team Gamma');

INSERT INTO skills (name) VALUES
                              ('JavaScript'),
                              ('Python'),
                              ('SQL'),
                              ('React'),
                              ('Node.js'),
                              ('CSS'),
                              ('HTML'),
                              ('Docker'),
                              ('AWS'),
                              ('GraphQL');

INSERT INTO user_skills (user_id, skill_id, skill_level) VALUES
                                                             (2, 1, 2),
                                                             (2, 2, 1),
                                                             (2, 4, 2),
                                                             (2, 5, 1),
                                                             (3, 1, 2),
                                                             (3, 2, 2),
                                                             (3, 6, 3),
                                                             (4, 3, 3),
                                                             (4, 8, 2),
                                                             (5, 1, 1),
                                                             (5, 3, 2),
                                                             (5, 7, 2),
                                                             (6, 2, 3),
                                                             (6, 9, 2),
                                                             (7, 3, 1),
                                                             (7, 10, 2);

INSERT INTO projects (name, project_status) VALUES
                                                ('Project X', 'IN_PROGRESS'),
                                                ('Project Y', 'IN_PROGRESS'),
                                                ('Project Z', 'IN_PROGRESS');

INSERT INTO team_users (team_id, user_id) VALUES
                                              (1, 1),
                                              (1, 2),
                                              (2, 4),
                                              (2, 3),
                                              (3, 5),
                                              (3, 6),
                                              (3, 7);

INSERT INTO project_teams (project_id, team_id) VALUES
                                                    (1, 1),
                                                    (2, 2),
                                                    (3, 3);


