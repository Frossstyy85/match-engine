import * as bcrypt from "bcrypt";
import db from "@/db/client"
import {Project, Skill, Team, User} from "@/lib/types";

const hashPassword: (raw: string) => Promise<string> = async (rawPassword) => bcrypt.hash(rawPassword, 12);

interface createUserRequest {
    name: string,
    email: string,
    password: string
}

export async function getUserNameAndEmail(id: number): Promise<User | undefined> {
    const sql = `SELECT name, email
                 FROM users
                 WHERE id = $1`;
    return db.query(sql, [id]).then(({rows}) => rows?.[0]);
}

export async function getUserById(id: number): Promise<User> {
    const sql = `SELECT id, name, email FROM users WHERE id = $1`
    const { rows } = await db.query(sql, [id])
    return rows[0]
}

export async function createUser(request: createUserRequest): Promise<number | undefined> {

    const password_hash = await hashPassword(request.password);

    return db.query(
        `INSERT INTO users
             (email, name, password_hash, role_id)
         SELECT $1, $2, $3, r.id
         FROM roles r
         WHERE r.name = 'ADMIN' RETURNING id;`,
        [request.email, request.name, password_hash]
    ).then(({rows}) => rows[0]?.id)

}

export async function findUserById(id: number): Promise<any | undefined> {
    const sql = `SELECT id, email, name, created_at
                 FROM users
                 WHERE id = $1;`;
    return db.query(sql, [id]).then(({rows}) => rows[0]);
}

export async function updatePassword(id: number, password: string) {
    const password_hash = await hashPassword(password);
    const sql = `UPDATE users
                 SET password_hash = $1
                 WHERE id = $2;`;
    return db.query(sql, [password_hash, id]).then(({rowCount}) => rowCount > 0)
}

export async function getPasswordHashById(id: number): Promise<any | undefined> {
    const sql = `SELECT password_hash
                 FROM users
                 WHERE id = $1;`;
    return db.query(sql, [id]).then(({rows}) => rows[0]);
}

export async function getUserAuthByEmail(email: string): Promise<User | undefined> {

    const sql = `SELECT u.id,
                        u.email,
                        u.password_hash,
                        r.name as role
                 FROM users u
                          JOIN roles r ON r.id = u.role_id
                 WHERE email = $1;`;

    const {rows} = await db.query<User>(sql, [email]);
    return rows[0];
}

export async function emailExists(email: string): Promise<boolean> {
    const sql = `SELECT id
                 FROM users
                 WHERE email = $1 LIMIT 1`
    return db.query(sql, [email]).then(({rowCount}) => rowCount > 0)
}

export async function getAllUsers(): Promise<User[]> {
    const sql = `SELECT id, name, email, created_at
                 FROM users
                 ORDER BY id ASC;`;
    return db.query(sql).then(({rows}) => rows)
}

export async function deleteUser(userId: number): Promise<boolean> {
    return db.query(`
        DELETE
        FROM users
        where id = $1
    `, [userId]).then(({rowCount}) => rowCount > 0)
}

export async function getUserProjects(userId: number): Promise<Project[]> {
    const sql = `
        SELECT DISTINCT p.id, p.name, p.status
        FROM projects p
                 JOIN project_teams pt ON pt.project_id = p.id
                 JOIN team_users tu ON tu.team_id = pt.team_id
        WHERE tu.user_id = $1
    `
    return db.query(sql, [userId]).then(({rows}) => rows)
}

export async function getUserSkills(userId: number): Promise<Skill[]> {
    const sql =
        `
            SELECT s.name, s.id, us.skill_level AS skill_level
            FROM user_skills us
                     JOIN skills s ON s.id = us.skill_id
            WHERE us.user_id = $1
        `;
    return db.query(sql, [userId]).then(({rows}) => rows);
}

export async function getUserTeams(userId: number): Promise<Team[]> {
    const sql = `
        SELECT t.id, t.name
        FROM teams t
                 JOIN team_users tu ON t.id = tu.team_id
        WHERE tu.user_id = $1
        ORDER BY t.name ASC
    `;
    const { rows: teams } = await db.query(sql, [userId]);
    return teams;
}

export async function getRecommendedProjects(userId: number): Promise<Project[]>{
    const sql = `
    SELECT p.id, p.name, p.status, COUNT(*) AS matched_projects
    FROM user_skills us
    JOIN project_required_skills prs
        ON prs.skill_id = us.skill_id
    JOIN projects p 
        ON p.id = prs.project_id
    WHERE us.user_id = $1
    GROUP BY p.id, p.name, p.status
    ORDER BY matched_projects DESC
    `

    const { rows } = await db.query(sql, [userId]);
    return rows;
}

