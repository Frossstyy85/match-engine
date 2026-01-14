import pool from "@/db/client";


export async function getUserProjects(userId: number){
    const sql = `
    SELECT p.id, p.name
    FROM users u
    JOIN team_users tu ON tu.user_id = u.id
    JOIN teams t ON tu.team_id = t.id
    JOIN project_teams pt ON pt.team_id = t.id
    JOIN projects p ON pt.project_id = p.id
    WHERE u.id = $1;
    `;
    const { rows } = await pool.query(sql,[userId])
    return rows;
}

export async function createProject(projectName: string){
    const sql = `
    INSERT INTO projects (name) VALUES ($1) RETURNING id, name, created_at
    `;
    const { rows } = await pool.query(sql, [projectName])
    return rows[0] ?? null;
}

export async function addTeam(teamId: number, projectId: number){
    const { rowCount } = await pool.query(`
    INSERT INTO project_teams (team_id, project_id) VALUES ($1, $2)
    `, [teamId, projectId])
    return rowCount > 0;
}

export async function getProjectById(projectId: number) {
    const sql = `SELECT id, name, created_at FROM projects WHERE id = $1;`;
    const { rows } = await pool.query(sql, [projectId]);
    return rows[0] ?? null;
}

export async function updateProject(projectId: number, fields: { name?: string }) {
    if (fields.name === undefined) return null;
    const sql = `
        UPDATE projects
        SET name = $1
        WHERE id = $2
        RETURNING id, name, created_at;
    `;
    const { rows } = await pool.query(sql, [fields.name, projectId]);
    return rows[0] ?? null;
}

export async function deleteProject(projectId: number){
    const { rowCount } = await pool.query(`
    DELETE FROM projects where id = $1
    `, [projectId]);
    return rowCount > 0;
}

export async function getProjects(){
    const { rows } = await pool.query(`
    SELECT id, name, created_at FROM projects ORDER BY id ASC
    `);
    return rows;
}






