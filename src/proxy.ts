import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export default async function authMiddleware(request: NextRequest) {
    const url = new URL(request.url);
    const sessionId = request.cookies.get("sessionId")?.value;
    const user = sessionId ? await getSession(sessionId) : null;

    if (!user) {
        if (url.pathname.startsWith("/register")) return NextResponse.next();
        if (!url.pathname.startsWith("/login")) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.next();
    }

    if (url.pathname.startsWith("/login") || url.pathname.startsWith("/register")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
};
