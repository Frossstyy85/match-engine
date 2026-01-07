import { usersTable } from "@/db/schema";
import db from "@/db/client";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";

export async function createUser({ email, name, password }) {

    const password_hash = await bcrypt.hash(password, 12);

    const [inserted] = await db
        .insert(usersTable)
        .values({ email, name, password_hash })
        .returning({ id: usersTable.id });

    return inserted;
}

export async function findUser(id: number) {
    const [user] = await db
        .select({
            id: usersTable.id,
            name: usersTable.name,
            email: usersTable.email,
        })
        .from(usersTable)
        .where(eq(usersTable.id, id));

    return user;
}

export async function updatePassword(id: number, password: string) {

    const password_hash = await bcrypt.hash(password, 12);

    await db
        .update(usersTable)
        .set({ password_hash })
        .where(eq(usersTable.id, id));

}

export async function getPasswordHashById(id: number) {
    const [row] = await db
        .select({
            id: usersTable.id,
            password_hash: usersTable.password_hash,
        })
        .from(usersTable)
        .where(eq(usersTable.id, id));

    return row;
}

export async function getPasswordHashByEmail(email: string) {
    const [row] = await db
        .select({
            id: usersTable.id,
            password_hash: usersTable.password_hash,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email));

    return row;
}

export async function emailExists(email: string) {
    const rows = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

    return rows.length > 0;
}

export async function getUsers(){
    return db.select().from(usersTable);
}
