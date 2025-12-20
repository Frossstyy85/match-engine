import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export async function POST(request: NextRequest) {
    const sessionId = request.cookies.get("sessionId")?.value;

    if (sessionId) {
        await deleteSession(sessionId);
    }

    const response = NextResponse.json({ ok: true });

    response.cookies.set("sessionId", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
    });

    return response;
}
