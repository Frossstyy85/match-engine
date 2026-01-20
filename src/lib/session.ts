import redis from "@/lib/redis";
import * as crypto from "node:crypto";
import {json} from "node:stream/consumers";

export interface Session {
    principal: Principal
}

export interface Principal {
    id: number
    role: string
}

function createSessionId(): string {
    return crypto.randomUUID();
}

export async function createSession(id: number, role: string): Promise<string>
{
    const sessionId = createSessionId();

    const sessionObj: Session = {
        principal: {
            id,
            role
        }
    }
    await redis.set(
        `sessionId:${sessionId}`,
        JSON.stringify(sessionObj),
        'EX',
        60 * 60 * 24 * 30
    )
    return sessionId;
}

export async function getSession(sessionId: string): Promise<Session | undefined> {

    const raw = await redis.get(`sessionId:${sessionId}`)

    if (!raw) return undefined

    return JSON.parse(raw);
}

export async function deleteSession(sessionId: string) {
    await redis.del(`sessionId:${sessionId}`);
}


