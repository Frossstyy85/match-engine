import {type NextRequest, NextResponse} from "next/server";
import {getSession} from "@/lib/session";
import {AUTH_COOKIE_NAME} from "@/lib/authCookies";

export async function proxy(request: NextRequest) {
    const token: string = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    return !token || !(await getSession(token))
    ? loginRedirect(request) : NextResponse.next();

}

export function loginRedirect(request: NextRequest) {
    return NextResponse.redirect(new URL("/authenticate", request.url))
}

export const config = {
    matcher: '/dashboard/:path*',
}