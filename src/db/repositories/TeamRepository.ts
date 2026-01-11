import pool from "@/db/client";


export async function getUserTeams(userId: number){
    const sql = `
    SELECT t.id, t.name FROM teams t
    JOIN team_users tu ON t.id = tu.team_id
    WHERE tu.user_id = $1
    ORDER BY t.name ASC
    `;
    const { rows: teams } = await pool.query(sql, [userId]);
    return teams;
}

export async function getProjectTeams(projectId: number){
    const sql = `
    SELECT t.id, t.name FROM teams t
    JOIN project_teams pt ON t.id = pt.team_id
    WHERE pt.project_id = $1
    ORDER BY t.name ASC 
    `;
    const { rows: teams } = await pool.query(sql, [projectId]);
    return teams;
}

export async function addUser(userId: number, teamId: number){
    const { rowCount } = await pool.query(`
    INSERT INTO team_users (user_id, team_id) VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    `, [userId, teamId])
    return rowCount > 0;
}

export async function deleteTeam(teamId: number){
    const { rowCount } = await pool.query(`
    DELETE FROM teams where id = $1
    `, [teamId]);
    return rowCount > 0;
}

export async function getTeams(){
    const { rows } = await pool.query(`
    SELECT id, name FROM teams
    `);
    return rows;
}



