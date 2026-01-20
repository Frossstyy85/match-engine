import db from "@/db/client";
import {Team, User} from "@/lib/types";

export async function createProject(projectName: string) {
    const sql = `
        INSERT INTO projects (name)
        VALUES ($1) RETURNING id, name
    `;
    const {rows} = await db.query(sql, [projectName])
    return rows[0] ?? null;
}

export async function addTeamToProject(teamId: number, projectId: number) {
    const {rowCount} = await db.query(`
        INSERT INTO project_teams (team_id, project_id)
        VALUES ($1, $2)
    `, [teamId, projectId])
    return rowCount > 0;
}

export async function getProjectById(projectId: number) {
    const sql = `SELECT id, name, status
                 FROM projects
                 WHERE id = $1;`;
    const {rows} = await db.query(sql, [projectId]);
    return rows[0] ?? null;
}

export async function deleteProject(projectId: number) {
    const {rowCount} = await db.query(`
        DELETE
        FROM projects
        where id = $1
    `, [projectId]);
    return rowCount > 0;
}

export async function getProjects() {
    const {rows} = await db.query(`
        SELECT id, name, status
        FROM projects
        ORDER BY id ASC
    `);
    return rows;
}

export async function getProjectTeams(projectId: number): Promise<Team[]> {
    const sql = `
        SELECT t.id, t.name
        FROM teams t
                 JOIN project_teams pt ON t.id = pt.team_id
        WHERE pt.project_id = $1
        ORDER BY t.name ASC
    `;
    const {rows: teams} = await db.query(sql, [projectId]);
    return teams;
}

export async function getRecommendedUsers(projectId: number): Promise<User[]> {
    const sql = `
        SELECT u.id AS user_id,
               rc.id AS role_configuration_id,
               r.name AS role_name,
               u.name AS user_name,
               
        COUNT(DISTINCT rcs.skill_id) AS matched_skills,
        COUNT(DISTINCT rcs.skill_id)::FLOAT / (
        SELECT COUNT(*)
        FROM role_configuration_skills
        WHERE role_configuration_id = rc.id
        ) as match_percentage
        FROM users u
        JOIN user_skills us ON us.user_id = u.id
        JOIN role_configuration_skills rcs ON rcs.skill_id = us.skill_id
        JOIN user_roles ur ON ur.user_id = u.id 
        JOIN roles r ON r.id = ur.role_id
        JOIN role_configuration rc ON rc.id = rcs.role_configuration_id AND rc.role_id = ur.role_id
        JOIN projects p ON rc.project_id = p.id  
        WHERE p.id = $1
        GROUP BY u.id, rc.id, r.id, u.name
        ORDER BY match_percentage DESC
    `


    const {rows} = await db.query(sql, [projectId]);
    console.log(rows)
    return rows;
}






