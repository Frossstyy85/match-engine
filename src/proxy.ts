import { NextRequest, NextResponse } from "next/server";
import { getSession, Session} from "@/lib/session";
import { UserRole} from "@/lib/types";

export default async function proxy(request: NextRequest) {

    const url = new URL(request.url);
    const sessionId: string | undefined = request.cookies.get("sessionId")?.value;
    const session: Session | null = sessionId ? await getSession(sessionId) : null;

    if (!session) {
        if (url.pathname.startsWith("/register")) return NextResponse.next();
        if (!url.pathname.startsWith("/login")) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.next();
    }

    if (url.pathname.startsWith("/admin")) {
        if (session.user.role === "admin") {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }



    if (url.pathname.startsWith("/login") || url.pathname.startsWith("/register")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register", "/admin"],
};

const protectedRoutes: { path: string; roles: UserRole[]  }[] = [
    { path: "/admin", roles: ["admin"] }
]


