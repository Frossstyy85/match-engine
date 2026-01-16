import { type NextRequest, NextResponse } from "next/server";
import {verifyToken} from "@/lib/jwt";
import {JWTPayload} from "jose";

export async function proxy(request: NextRequest){
    const token: string = request.cookies.get("auth")?.value;
    if (!token)
        return loginRedirect(request)
    const payload: JWTPayload = await verifyToken(token)
    if (!payload)
        return loginRedirect(request)
    return NextResponse.next();
}

export function loginRedirect(request: NextRequest){
    return NextResponse.redirect(new URL("authenticate", request.url))
}

export const config = {
    matcher: '/dashboard/:path*',
}