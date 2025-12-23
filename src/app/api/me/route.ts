import { NextRequest, NextResponse } from "next/server";
import { getSession, Session } from "@/lib/session";

export async function GET(request: NextRequest): Promise<NextResponse<{ session: Session | null}>> {
    try {
        const sessionId: string | undefined = request.cookies.get("sessionId")?.value;

        if (!sessionId) {
            return NextResponse.json({ session: null });
        }

        const session: Session | null = await getSession(sessionId);

        return NextResponse.json({ session: session ?? null })
    } catch (error) {
        return NextResponse.json({ session: null });
    }
}
