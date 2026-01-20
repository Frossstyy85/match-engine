CREATE TYPE project_status AS ENUM (
    'IN_PROGRESS',
    'COMPLETED'
    );

CREATE TABLE languages (
    id SERIAL PRIMARY KEY,
    code CHAR(5) UNIQUE NOT NULL,
    name_en VARCHAR(100) NOT NULL
);

CREATE TABLE system_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT,
    primary_language_id INT REFERENCES languages(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_system_role FOREIGN KEY(role_id) REFERENCES system_roles(id)
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE user_roles (
    experience_years INT DEFAULT 0,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_user_roles_role FOREIGN KEY(role_id) REFERENCES roles(id)
);

CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status project_status DEFAULT 'IN_PROGRESS'
);

CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE user_skills (
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    skill_level INT NOT NULL DEFAULT 0 CHECK (skill_level BETWEEN 0 AND 3),
    PRIMARY KEY(user_id, skill_id),
    CONSTRAINT fk_user_skills_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_skills_skill FOREIGN KEY(skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE role_configuration (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    role_id INT NOT NULL,
    number_of_positions INT NOT NULL,
    required_experience_years INT NOT NULL,
    CONSTRAINT fk_role_config_project FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_config_role FOREIGN KEY(role_id) REFERENCES roles(id)
);

CREATE TABLE role_configuration_skills (
    role_configuration_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY(role_configuration_id, skill_id),
    CONSTRAINT fk_rcs_role_config FOREIGN KEY(role_configuration_id) REFERENCES role_configuration(id) ON DELETE CASCADE,
    CONSTRAINT fk_rcs_skill FOREIGN KEY(skill_id) REFERENCES skills(id)
);

CREATE TABLE team_users (
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY(team_id, user_id),
    CONSTRAINT fk_team_users_team FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT fk_team_users_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE project_teams (
    project_id INT NOT NULL,
    team_id INT NOT NULL,
    PRIMARY KEY(project_id, team_id),
    CONSTRAINT fk_project_teams_project FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_project_teams_team FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE
);

INSERT INTO system_roles (name)
VALUES ('ADMIN'), ('USER'), ('HR'), ('PROJECT_LEAD'), ('TEAM_LEAD');

INSERT INTO users (name, email, password_hash, role_id)
VALUES
    ('Alice', 'alice@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 1),
    ('Bob', 'bob@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 2),
    ('Carol', 'carol@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 3),
    ('Dave', 'dave@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 4),
    ('Eve', 'eve@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 2),
    ('Frank', 'frank@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 2),
    ('Grace', 'grace@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 3);




INSERT INTO teams (name)
VALUES ('Team Alpha'), ('Team Beta'), ('Team Gamma');

INSERT INTO projects (name, status)
VALUES ('Project X', 'IN_PROGRESS'), ('Project Y', 'IN_PROGRESS'), ('Project Z', 'IN_PROGRESS');

INSERT INTO skills (name)
VALUES ('JavaScript'), ('Python'), ('SQL'), ('React'), ('Node.js'), ('CSS'), ('HTML'), ('Docker'), ('AWS'), ('GraphQL');

INSERT INTO roles (name)
VALUES ('FRONTEND DEVELOPER'), ('BACKEND DEVELOPER'), ('CLOUD ENGINEER'), ('FULLSTACK DEVELOPER');

INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);

INSERT INTO team_users (team_id, user_id) VALUES (1,1);

INSERT INTO project_teams (project_id, team_id) VALUES (1,1);

INSERT INTO user_skills (user_id, skill_id) VALUES (1,1), (2,1), (3,1), (4,1);

INSERT INTO role_configuration (project_id, role_id, number_of_positions, required_experience_years)
VALUES (1,1,1,1);

INSERT INTO role_configuration_skills (role_configuration_id, skill_id)
VALUES (1,1), (1,2);

-- Additional Users
INSERT INTO users (name, email, password_hash, role_id)
VALUES
    ('Hank', 'hank@example.com', 'hash', 2),
    ('Ivy', 'ivy@example.com', 'hash', 3),
    ('Jack', 'jack@example.com', 'hash', 4),
    ('Kara', 'kara@example.com', 'hash', 2),
    ('Leo', 'leo@example.com', 'hash', 5),
    ('Mona', 'mona@example.com', 'hash', 1),
    ('Nina', 'nina@example.com', 'hash', 2),
    ('Omar', 'omar@example.com', 'hash', 3),
    ('Pam', 'pam@example.com', 'hash', 4),
    ('Quinn', 'quinn@example.com', 'hash', 5);

INSERT INTO teams (name)
VALUES ('Team Delta'), ('Team Epsilon'), ('Team Zeta'), ('Team Eta'), ('Team Theta');

INSERT INTO projects (name, status)
VALUES
    ('Project A', 'IN_PROGRESS'),
    ('Project B', 'IN_PROGRESS'),
    ('Project C', 'COMPLETED'),
    ('Project D', 'IN_PROGRESS'),
    ('Project E', 'COMPLETED');

INSERT INTO skills (name)
VALUES
    ('Kubernetes'), ('Terraform'), ('C++'), ('Java'), ('Go'),
    ('Ruby'), ('Scala'), ('Elixir'), ('Rust'), ('PHP');

INSERT INTO roles (name)
VALUES
    ('DATA ENGINEER'), ('DEVOPS ENGINEER'), ('MACHINE LEARNING ENGINEER'), ('QA ENGINEER'),
    ('PRODUCT MANAGER'), ('UX DESIGNER'), ('SECURITY ENGINEER'), ('MOBILE DEVELOPER');

INSERT INTO user_roles (user_id, role_id, experience_years)
VALUES
    (2, 2, 3), (3, 3, 2), (4, 1, 5), (5, 4, 1), (6, 5, 2),
    (7, 6, 4), (8, 7, 3), (9, 8, 2), (10, 1, 1), (1, 2, 3);

INSERT INTO team_users (team_id, user_id)
VALUES
    (2, 2), (2, 3), (3, 4), (3, 5), (4, 6),
    (4, 7), (5, 8), (5, 9), (1, 10), (1, 3);

INSERT INTO project_teams (project_id, team_id)
VALUES
    (2, 2), (3, 3), (4, 4), (5, 5), (1, 5);

INSERT INTO role_configuration (project_id, role_id, number_of_positions, required_experience_years)
VALUES
    (2, 2, 2, 2), (3, 3, 1, 3), (4, 4, 2, 1), (5, 5, 1, 4), (1, 6, 3, 2);

INSERT INTO role_configuration_skills (role_configuration_id, skill_id)
VALUES
    (1, 3), (1, 4), (2, 5), (2, 6), (3, 7), (3, 8), (4, 9), (4, 10), (5, 1), (5, 2),
    (1, 5), (2, 1), (3, 2), (4, 3), (5, 4);

