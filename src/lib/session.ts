import redis from "@/lib/redis";
import { v4 as uuidv4 } from "uuid";
import type { User } from "@/lib/types";

export interface Session {
    user: User;
}

const SESSION_TTL = 60 * 60 * 24;

export async function createSession(user: User): Promise<string> {
    const sessionId = uuidv4();
    const session: Session = { user };

    await redis.set(
        `session:${sessionId}`,
        JSON.stringify(session),
        "EX",
        SESSION_TTL
    );

    return sessionId;
}

export async function getSession(sessionId: string): Promise<Session | null> {
    const data = await redis.get(`session:${sessionId}`);
    if (!data) return null;

    try {
        return JSON.parse(data) as Session;
    } catch {
        return null;
    }
}

export async function deleteSession(sessionId: string): Promise<void> {
    await redis.del(`session:${sessionId}`);
}


