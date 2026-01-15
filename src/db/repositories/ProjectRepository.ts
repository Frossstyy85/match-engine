import db from "@/db/client";

export async function createProject(projectName: string){
    const sql = `
    INSERT INTO projects (name) VALUES ($1) RETURNING id, name, created_at
    `;
    const { rows } = await db.query(sql, [projectName])
    return rows[0] ?? null;
}

export async function addTeamToProject(teamId: number, projectId: number){
    const { rowCount } = await db.query(`
    INSERT INTO project_teams (team_id, project_id) VALUES ($1, $2)
    `, [teamId, projectId])
    return rowCount > 0;
}

export async function getProjectById(projectId: number) {
    const sql = `SELECT id, name, project_status FROM projects WHERE id = $1;`;
    const { rows } = await db.query(sql, [projectId]);
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
    const { rows } = await db.query(sql, [fields.name, projectId]);
    return rows[0] ?? null;
}

export async function deleteProject(projectId: number){
    const { rowCount } = await db.query(`
    DELETE FROM projects where id = $1
    `, [projectId]);
    return rowCount > 0;
}

export async function getProjects(){
    const { rows } = await db.query(`
    SELECT id, name, project_status FROM projects ORDER BY id ASC
    `);
    return rows;
}






