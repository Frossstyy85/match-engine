import {NextRequest, NextResponse} from "next/server";
import { createSession } from "@/lib/session";
import { User } from "@/lib/types";
import bcrypt from "bcrypt"
import { createUser, getUserByEmail} from "@/repositories/users";


interface RequestBody {
    email: string;
    password: string;
}


export async function POST(request: NextRequest){

    try {

        const body: RequestBody = (await request.json()) as RequestBody;

        const { email, password } = body;

        const user = await getUserByEmail(email);

        if (user) {

            const isValid: boolean = await bcrypt.compare(password, user.password);


            if (isValid) {

                const currentUser: User = {
                 id: user.id,
                 name: user.name,
                 email: user.email,
                 role: user.role
                 }

               /** const currentUser: User = {
                    id: 1,
                    name: "alice",
                    email:"alice@gmail.com",
                    role: "project_lead"
                } **/

                const sessionId = await createSession(currentUser)
                const response: NextResponse<{ user: User }> = NextResponse.json({user: currentUser})
                response.cookies.set("sessionId", sessionId, {
                    httpOnly: true,
                    path: "/"
                })


                return response;
            }

        }

        return NextResponse.json({ error: "Invalid request" }, { status: 400 })

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }


}