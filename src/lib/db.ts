  import { Pool } from "pg";

  export const pool = new Pool({
    user: "app_user",
    database: "app_db",
    host: "localhost",
    password: "app_password",
    port: 5432,
    max: 5,
  });

  export async function queryMany<T>(sql: string, params: any[]): Promise<T[] | null> {
    const { rows } = await pool.query(sql, params);
    return rows ?? null;
  }

  export async function queryOne<T>(sql: string, params: any[]): Promise<T | null> {
    const { rows } = await pool.query(sql, params);
    return rows[0] ?? null;
  }

  export async function deleteQuery(sql: string, params: any[]): Promise<boolean> {
    const { rowCount } = await pool.query(sql, params);
    return rowCount > 0;

  }