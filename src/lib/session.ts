import redis from "@/lib/redis";
import { v4 as uuidv4 } from "uuid";
import type { User } from "@/lib/types";

export async function createSession(user: User) {
    const sessionId: string = uuidv4();
    await redis.set(`session:${sessionId}`, JSON.stringify(user), "EX", 60 * 60 * 24);
    return sessionId;
}

export async function getSession(sessionId: string): Promise<User | null> {
    try {
        const data = await redis.get(`session:${sessionId}`);
        if (!data) return null;

        try {
            const user: User = JSON.parse(data);
            return user;
        } catch (err) {
            console.error("Failed to parse session data:", err);
            return null;
        }
    } catch (err) {
        console.error("Redis getSession error:", err);
        return null;
    }
}

export async function deleteSession(sessionId: string) {
    await redis.del(`session:${sessionId}`);
}
