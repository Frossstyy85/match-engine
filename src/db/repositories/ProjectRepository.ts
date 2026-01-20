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
        SELECT u.id, u.name, u.email, COUNT(*) AS matched_users
        FROM project_required_skills prs
                 JOIN skills s
                      ON prs.skill_id = s.id
                 JOIN user_skills us
                      ON us.skill_id = s.id
                 JOIN users u
                      ON u.id = us.user_id
        WHERE prs.project_id = $1
        GROUP BY u.id, u.name, u.email
        ORDER BY matched_users DESC;
    `
    const {rows} = await db.query(sql, [projectId]);
    return rows;
}






