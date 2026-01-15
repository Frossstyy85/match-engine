import * as bcrypt from "bcrypt";
import db from "@/db/client"
import { runTransaction } from "@/db/helper";

const hashPassword: (raw: string) => Promise<string> = async (rawPassword) => bcrypt.hash(rawPassword, 12);

export async function createUser(
    {
        email,
        name,
        password }:
    {
        email: string,
        name: string,
        password: string
    }) {

    const password_hash = await hashPassword(password);
    const newId = await runTransaction(db, async (tx) => {

        const userResult = await tx.query(
            `INSERT INTO users
             (email, name, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id;`,
            [email, name, password_hash]
        );
        const userId = userResult.rows[0]?.id;
        if (!userId) throw new Error("User insert failed");

        const roleResult = await tx.query(
            `SELECT id FROM roles WHERE name = 'ADMIN';`
        );
        const roleId = roleResult.rows[0]?.id;
        if (!roleId) throw new Error("Role not found");

        const roleInsert = await tx.query(
            `INSERT INTO user_roles
             (role_id, user_id)
             VALUES ($1, $2);`,
            [roleId, userId]
        );
        if (roleInsert.rowCount === 0) throw new Error("Failed to assign role");
        return userId;
    });


    return newId ?? null;
}


export async function findUserById(id: number) {
    const sql = `SELECT id, email, name, created_at FROM users WHERE id = $1;`;
    const { rows } = await db.query(sql, [id]);
    return rows[0] ?? null;
}

export async function updatePassword(id: number, password: string) {
    const password_hash = await hashPassword(password);
    const sql = `UPDATE users SET password_hash = $1 WHERE id = $2;`;
    const { rowCount } =  await db.query(sql, [password_hash, id]);
    return rowCount > 0;
}

export async function getPasswordHashById(id: number) {
    const sql = `SELECT password_hash FROM users WHERE id = $1;`;
    const { rows } = await db.query(sql, [id])
    return rows[0] ?? null;
}

export async function getUserAuthByEmail(email: string) {
    const sql = `SELECT id, email, password_hash FROM users WHERE email = $1;`;
    const { rows } = await db.query(sql, [email]);

    const userRow = rows[0];
    if (!userRow) return null;

    const roles = await getUserRoles(userRow?.id);
    return {
        ...userRow,
        roles: roles.map(r => r.name)
    }
}

async function getUserRoles(userId: number): Promise<{ name: string }[]> {
    const sql = `
    SELECT r.name
    FROM user_roles ur 
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = $1;
    `;
    const { rows } = await db.query(sql, [userId]);
    return rows;
}

export async function emailExists(email: string): Promise<boolean> {
    const sql = `SELECT
     EXISTS( SELECT 1 FROM users WHERE email = $1)
      AS email_exists;`
    const { rows } = await db.query(sql, [email]);
    return rows[0]?.email_exists ?? false;
}

export async function getAllUsers() {
    const sql = `SELECT id, name, email, created_at FROM users ORDER BY id ASC;`;
    const { rows } = await db.query(sql);
    return rows;
}

export async function deleteUser(userId: number) {
    const { rowCount } = await db.query(`
    DELETE FROM users where id = $1
    `, [userId]);
    return rowCount > 0;
}

export async function getUserProjects(userId: number){
    const sql = `
    SELECT DISTINCT p.id, p.name, p.project_status
    FROM projects p
    JOIN project_teams pt ON pt.project_id = p.id
    JOIN team_users tu ON tu.team_id = pt.team_id
    WHERE tu.user_id = $1
    `
    const { rows } = await db.query(sql,[userId])

    return rows;
}

export async function getUserSkills(userId: number){
    const sql =
        `
        SELECT s.name, s.id, us.skill_level AS skill_level
        FROM user_skills us
        JOIN skills s ON s.id = us.skill_id
        WHERE us.user_id = $1
`;
    const { rows } = await db.query(sql, [userId]);
    return rows;
}

