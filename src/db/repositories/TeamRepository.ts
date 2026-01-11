import pool from "@/db/client";


interface Team {
    id: number,
    name: string
}

export async function getUserTeams(userId: number): Promise<Team[]>{
    const sql = `
    SELECT t.id, t.name FROM teams t
    JOIN team_users tu ON t.id = tu.team_id
    WHERE tu.user_id = $1
    ORDER BY t.name ASC
    `;
    const { rows: teams } = await pool.query<Team>(sql, [userId]);
    return teams;
}

export async function getProjectTeams(projectId: number): Promise<Team[]>{
    const sql = `
    SELECT t.id, t.name FROM teams t
    JOIN project_teams pt ON t.id = pt.team_id
    WHERE pt.project_id = $1
    ORDER BY t.name ASC 
    `;
    const { rows: teams } = await pool.query<Team>(sql, [projectId]);
    return teams;
}

