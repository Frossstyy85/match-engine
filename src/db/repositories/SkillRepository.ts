import db from "@/db/client"

export async function getSkills(){
    const sql = `SELECT * FROM skills`
    const { rows } = await db.query(sql);
    return rows;
}