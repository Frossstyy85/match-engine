import {NextResponse} from "next/server";
import bcrypt from "bcrypt";
import {AUTH_COOKIE_NAME, sessionCookieOptions} from "@/lib/authCookies";
import {getUserAuthByEmail} from "@/db/repositories/UserRepository";
import {createSession} from "@/lib/session";

export async function POST(req) {



    try {
        const {email, password} = await req.json();

        if (!email || !password) {
            return NextResponse.json({message: "missing fields"}, {status: 400});
        }

        const userAuth = await getUserAuthByEmail(email);

        if (!userAuth) {
            return NextResponse.json({message: "Invalid credentials"}, {status: 401});
        }

        const isValid = await bcrypt.compare(password, userAuth.password_hash);

        if (!isValid) {
            return NextResponse.json({message: "Invalid credentials"}, {status: 401});
        }

        const sessionId = await createSession(userAuth.id, userAuth.role);
        if (!sessionId)
            throw new Error("Something went wrong")

        const res = NextResponse.json({message: "Login successful"}, {status: 200});

        res.cookies.set(AUTH_COOKIE_NAME, sessionId, sessionCookieOptions);

        return res;


    } catch (err) {
        return NextResponse.json({message: err.message}, {status: 500});
    }
}