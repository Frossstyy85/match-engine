import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
    try {
        const sessionId = request.cookies.get("sessionId")?.value;

        if (!sessionId) {
            return NextResponse.json({ user: null });
        }

        const user = await Promise.race([
            getSession(sessionId),
            new Promise<null>((resolve) => 
                setTimeout(() => resolve(null), 3000)
            )
        ]);
        
        if (!user) {
            return NextResponse.json({ user: null });
        }
        
        return NextResponse.json({ user });
    } catch (error) {
        console.error("Error in /api/me:", error);
        return NextResponse.json({ user: null });
    }
}
