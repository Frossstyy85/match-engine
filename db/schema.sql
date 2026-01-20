CREATE TYPE project_status AS ENUM (
    'IN_PROGRESS',
    'COMPLETED'
    );

CREATE TABLE languages (
    id SERIAL PRIMARY KEY,
    code CHAR(5) UNIQUE NOT NULL,
    name_en VARCHAR(100) NOT NULL
);

CREATE TABLE roles
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE users
(
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id       INT REFERENCES roles (id),
    primary_language_id INT REFERENCES languages(id),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teams
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skills
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE projects
(
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    created_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    status project_status DEFAULT 'IN_PROGRESS'
);


CREATE TABLE user_skills
(
    skill_id    INT NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
    user_id     INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    skill_level INT NOT NULL DEFAULT 0 CHECK (skill_level BETWEEN 0 AND 3),
    PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE project_required_skills (
    project_id INT NOT NULL REFERENCES projects(id),
    skill_id INT NOT NULL REFERENCES skills(id),
    primary key (project_id, skill_id)
);

CREATE TABLE team_users
(
    team_id INT NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (team_id, user_id)
);

CREATE TABLE project_teams
(
    project_id INT NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
    team_id    INT NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, team_id)
);

CREATE INDEX idx_team_users_user_team ON team_users (user_id, team_id);
CREATE INDEX idx_project_teams_team_project ON project_teams (team_id, project_id);




INSERT INTO roles (name)
VALUES ('ADMIN'),
       ('USER'),
       ('HR'),
       ('PROJECT_LEAD'),
       ('TEAM_LEAD');

INSERT INTO users (name, email, password_hash, role_id)
VALUES ('Alice', 'alice@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 1),
       ('Bob', 'bob@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 2),
       ('Carol', 'carol@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 3),
       ('Dave', 'dave@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 4),
       ('Eve', 'eve@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 2),
       ('Frank', 'frank@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 2),
       ('Grace', 'grace@example.com', '$2a$12$z11cIR0hQX.FobMjPzF0le2JsBWNI7S4wg3iFIPYKbvWHB1GvJaLG', 3);

INSERT INTO teams (name)
VALUES ('Team Alpha'),
       ('Team Beta'),
       ('Team Gamma');

INSERT INTO skills (name)
VALUES ('JavaScript'),
       ('Python'),
       ('SQL'),
       ('React'),
       ('Node.js'),
       ('CSS'),
       ('HTML'),
       ('Docker'),
       ('AWS'),
       ('GraphQL');

INSERT INTO user_skills (user_id, skill_id, skill_level)
VALUES (2, 1, 2),
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

INSERT INTO projects (name, status)
VALUES ('Project X', 'IN_PROGRESS'),
       ('Project Y', 'IN_PROGRESS'),
       ('Project Z', 'IN_PROGRESS');

INSERT INTO team_users (team_id, user_id)
VALUES (1, 1),
       (1, 2),
       (2, 4),
       (2, 3),
       (3, 5),
       (3, 6),
       (3, 7);

INSERT INTO project_teams (project_id, team_id)
VALUES (1, 1),
       (2, 2),
       (3, 3);

INSERT INTO languages (code, name_en) VALUES
                                          ('en', 'English'),
                                          ('fr', 'French'),
                                          ('es', 'Spanish'),
                                          ('de', 'German'),
                                          ('it', 'Italian'),
                                          ('pt', 'Portuguese'),
                                          ('ru', 'Russian'),
                                          ('zh', 'Chinese'),
                                          ('ja', 'Japanese'),
                                          ('ar', 'Arabic'),
                                          ('hi', 'Hindi'),
                                          ('bn', 'Bengali'),
                                          ('pa', 'Punjabi'),
                                          ('ur', 'Urdu'),
                                          ('id', 'Indonesian'),
                                          ('ms', 'Malay'),
                                          ('vi', 'Vietnamese'),
                                          ('ko', 'Korean'),
                                          ('th', 'Thai'),
                                          ('tr', 'Turkish'),
                                          ('fa', 'Persian'),
                                          ('sw', 'Swahili'),
                                          ('tl', 'Tagalog'),
                                          ('ta', 'Tamil'),
                                          ('te', 'Telugu'),
                                          ('ml', 'Malayalam'),
                                          ('mr', 'Marathi'),
                                          ('gu', 'Gujarati'),
                                          ('kn', 'Kannada'),
                                          ('or', 'Odia'),
                                          ('si', 'Sinhala'),
                                          ('he', 'Hebrew'),
                                          ('sv', 'Swedish'),
                                          ('da', 'Danish'),
                                          ('no', 'Norwegian'),
                                          ('fi', 'Finnish'),
                                          ('nl', 'Dutch'),
                                          ('pl', 'Polish'),
                                          ('ro', 'Romanian'),
                                          ('hu', 'Hungarian'),
                                          ('cs', 'Czech'),
                                          ('sk', 'Slovak'),
                                          ('bg', 'Bulgarian'),
                                          ('sr', 'Serbian'),
                                          ('hr', 'Croatian'),
                                          ('sl', 'Slovenian'),
                                          ('el', 'Greek'),
                                          ('ka', 'Georgian'),
                                          ('hy', 'Armenian'),
                                          ('az', 'Azerbaijani'),
                                          ('kk', 'Kazakh'),
                                          ('uz', 'Uzbek'),
                                          ('mn', 'Mongolian'),
                                          ('lo', 'Lao'),
                                          ('my', 'Burmese'),
                                          ('km', 'Khmer'),
                                          ('ne', 'Nepali'),
                                          ('other', 'Other');

INSERT INTO project_required_skills (project_id, skill_id)
VALUES (1,1), (2, 2)


