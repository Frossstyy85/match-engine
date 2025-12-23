
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function createUser(data: { name: string; email: string; password: string }) {
    return db.insert(users)
        .values({
            name: data.name,
            email: data.email,
            password: data.password
        })
        .returning()
        .then(rows => rows[0])
}

export async function getUserByEmail(email: string){
    return db.select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
        .then(rows => rows[0])
}

export async function getUserById(id: number){
    return db.select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1)
        .then(rows => rows[0])
}

export async function getUsers(){
    return db.select()
        .from(users)
        .limit(20)
}

