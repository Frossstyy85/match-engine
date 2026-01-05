import { queryOne, queryMany, deleteQuery } from "@/lib/db";

export class BaseRepository<T> {

    private table: string;

    public constructor(table: string) {
        this.table = table;
    }

    async getById(id: number): Promise<T | null> {
        const sql = `SELECT * FROM ${this.table} WHERE id = $1`;
        return queryOne<T>(sql, [id]);
    }

    async create(fields: Partial<T>): Promise<T | null> {
        const columns = Object.keys(fields).join(", ");
        const placeholders  = Object.keys(fields).map((_, i) => `$${i + 1}`).join(", ");
        const values = Object.values(fields);
        const sql = `INSERT INTO ${this.table} (${columns}) VALUES (${placeholders}) RETURNING *`;
        return queryOne<T>(sql, values);
    }

    async update(id: number, fields: Partial<T>): Promise<T | null> {
        const set = Object.keys(fields)
            .map((key, i) => `${key} = $${i + 1}`)
            .join(", ");
        const values = Object.values(fields);
        const sql = `UPDATE ${this.table} SET ${set} WHERE id = $${values.length + 1} RETURNING *`;
        return queryOne<T>(sql, [...values, id]);
    }

    async delete(id: number): Promise<void> {
        const sql = `DELETE FROM ${this.table} WHERE id = $1`;
        await deleteQuery(sql, [id]);
    }

}

