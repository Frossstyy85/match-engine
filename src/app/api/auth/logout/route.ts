import {NextRequest, NextResponse} from "next/server";
import {AUTH_COOKIE_NAME, clearedSessionCookie} from "@/lib/authCookies";
import {deleteSession} from "@/lib/session";

export async function POST(request: NextRequest) {
    const response = NextResponse.json({message: "logged out"}, {status: 200});
    const sessionId = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (sessionId)
        await deleteSession(sessionId);
    response.cookies.set(clearedSessionCookie);
    return response;
}
