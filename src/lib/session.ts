import Redis from "ioredis";

const sessions = new Map<string, string>()

interface Session {
    id: string
    role: string
}

interface SessionRequest {
    id: string
    role: string
}

function createSessionId(){
    return crypto.randomUUID();
}

export function createSession(request: SessionRequest) {
    const { id, role } = request;
    const sessionId = createSessionId();
    const session: Session = {
        id,
        role
    }


    sessions.set(`sessionId:${sessionId}`, JSON.stringify(session));
    console.log(sessions)
    return sessionId;
}

export async function getSession(sessionId: String): Promise<Session | undefined> {
    const session: string = sessions.get(`sessionId:${sessionId}`)
    if (!session) return undefined;
    return JSON.parse(session) as Session;
}

export async function deleteSession(sessionId: string){
    sessions.delete(`sessionId:${sessionId}`);
}


