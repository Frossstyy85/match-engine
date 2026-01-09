import "server-only";
import {rolesTable, userRolesTable, usersTable} from "@/db/schema";
import { db } from "@/db/client";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";

const hashPassword: (raw: string) => Promise<string> =
    async (rawPassword) => bcrypt.hash(rawPassword, 12);

export async function createUser({ email, name, password }) {

    const password_hash = await hashPassword(password);

    const userId: number = await db.transaction(async (tx) => {
        const [row] = await tx
            .insert(usersTable)
            .values({ email, name, password_hash })
            .returning({ id: usersTable.id });


        const roleIds = [1];

        await tx.insert(userRolesTable).values(
            roleIds.map(roleId => ({ roleId: roleId, userId: row.id}))
        );
        return row.id;
    })

    return userId;

}

export async function findUserById(id: number) {
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

    const password_hash = await hashPassword(password);

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

export async function getUserAuthByEmail(email: string) {

    const [user] = await db
        .select({
            id: usersTable.id,
            password_hash: usersTable.password_hash,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email));

    if (!user) return null

    const roles = await getUserRoles(user.id);

    return {
        ...user,
        roles: roles.map(role => role.name),
    };
}

async function getUserRoles(userId: number): Promise<{ name: string}[]>{
    return db
        .select({ name: rolesTable.name })
        .from(userRolesTable)
        .innerJoin(rolesTable, eq(rolesTable.id, userRolesTable.roleId))
        .where(eq(userRolesTable.userId, userId));
}


export async function emailExists(email: string): Promise<boolean> {
    const rows = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

    return rows.length > 0;
}

export async function getAllUsers(){
    return db.select().from(usersTable);
}

