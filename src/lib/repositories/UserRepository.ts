import { BaseRepository } from "@/lib/repositories/BaseRepository";
import {queryOne} from "@/lib/db";

export interface User {
    id: number,
    name: string,
    email: string,
    password_hash: string
}

type UserCredentials = Pick<User, "id" | "email" | "password_hash">


class UserRepository extends BaseRepository<User> {

    constructor(table: string = "users") {
        super(table);
    }

    async getUserCredentials(email: string): Promise<UserCredentials | null> {
        const sql = `SELECT id, email, password_hash FROM users WHERE email = $1`;
        const result = await queryOne<UserCredentials>(sql, [email]);
        return result ?? null;
    }

    async emailExists(email: string): Promise<boolean> {
        const sql = `SELECT EXISTS ( SELECT 1 FROM users WHERE email = $1) AS exists`;
        const result = await queryOne<{ exists: boolean }>(sql, [email]);
        return result?.exists ?? false;
    }

    async getPasswordHash(id: number): Promise<string | null> {
        const sql = ` SELECT password_hash  FROM users WHERE id = $1`;
        const result = await queryOne<{ password_hash: string }>(sql, [id]);
        return result?.password_hash ?? null;
    }


}

const userRepository = new UserRepository();

export default userRepository;