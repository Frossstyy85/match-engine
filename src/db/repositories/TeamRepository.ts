import db from "@/db/client";
import {Team, User} from "@/lib/types";

export async function getTeamUsers(teamId: number): Promise<User[]> {
    const sql = `
        SELECT id, name, email
        FROM users u
                 JOIN team_users tu ON tu.user_id = u.id
        WHERE tu.team_id = $1
    `;
    const {rows} = await db.query(sql, [teamId]);
    return rows;
}

export async function addUserToTeam(userId: number, teamId: number): Promise<Team> {
    const sql = `
    WITH team_cte AS ( SELECT * FROM teams WHERE id = $1 ),
    insert_cte AS ( INSERT INTO team_users (user_id, team_id)
    SELECT $2, id FROM team_cte)
    SELECT * FROM team_cte
    `
    const { rows } = await db.query(sql, [teamId, userId]);
    return rows[0];
}

export async function createTeam(name: string): Promise<Team> {
    const sql = `INSERT INTO teams (name)VALUES ($1) RETURNING *`;

    const { rows } = await db.query(sql, [name]);
    return rows[0] ?? null;
}

export async function getTeamById(teamId: number): Promise<Team> {
    const sql = `SELECT id, name, created_at
                 FROM teams
                 WHERE id = $1;`;
    const { rows } = await db.query(sql, [teamId]);
    return rows[0] ?? null;
}

export async function deleteTeam(teamId: number): Promise<Team> {
    const sql = 'DELETE FROM teams WHERE id = $1 RETURNING *'
    const { rows } = await db.query(sql, [teamId])
    return rows[0]
}

export async function getTeams(): Promise<Team[]> {
    const sql = 'SELECT id, name FROM teams ORDER BY ID asc'
    const { rows } = await db.query(sql);
    return rows;
}



