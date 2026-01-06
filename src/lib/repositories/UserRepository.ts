import { pool } from "@/lib/db";

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at?: string;
}

export type UserCredentials = Pick<User, "id" | "email" | "password_hash">;

class UserRepository {
  async getById(id: number): Promise<User | null> {
    const sql = `SELECT * FROM users WHERE id = $1`;
    const { rows } = await pool.query<User>(sql, [id]);
    return rows[0] ?? null;
  }

  async create(fields: Pick<User, "name" | "email" | "password_hash">): Promise<User | null> {
    const sql = `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *`;
    const { rows } = await pool.query<User>(sql, [
      fields.name,
      fields.email,
      fields.password_hash,
    ]);
    return rows[0] ?? null;
  }

  async update(id: number, fields: Partial<Pick<User, "name" | "email" | "password_hash">>) {
    const updates: string[] = [];
    const values: any[] = [];

    if (fields.name !== undefined) {
      values.push(fields.name);
      updates.push(`name = $${values.length}`);
    }
    if (fields.email !== undefined) {
      values.push(fields.email);
      updates.push(`email = $${values.length}`);
    }
    if (fields.password_hash !== undefined) {
      values.push(fields.password_hash);
      updates.push(`password_hash = $${values.length}`);
    }

    if (updates.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`;
    const { rows } = await pool.query<User>(sql, values);
    return rows[0] ?? null;
  }

  async getUserCredentials(email: string): Promise<UserCredentials | null> {
    const sql = `SELECT id, email, password_hash FROM users WHERE email = $1`;
    const { rows } = await pool.query<UserCredentials>(sql, [email]);
    return rows[0] ?? null;
  }

  async emailExists(email: string): Promise<boolean> {
    const sql = `SELECT EXISTS (SELECT 1 FROM users WHERE email = $1) AS exists`;
    const { rows } = await pool.query<{ exists: boolean }>(sql, [email]);
    return rows[0]?.exists ?? false;
  }

  async getPasswordHash(id: number): Promise<string | null> {
    const sql = `SELECT password_hash FROM users WHERE id = $1`;
    const { rows } = await pool.query<{ password_hash: string }>(sql, [id]);
    return rows[0]?.password_hash ?? null;
  }
}

const userRepository = new UserRepository();
export default userRepository;


