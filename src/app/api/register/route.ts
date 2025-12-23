
import {NextRequest, NextResponse} from "next/server";
import { createUser } from "@/repositories/users";
import bcrypt from "bcrypt";


interface RequestBody {
        email: string,
        name: string,
        password: string
    }

    export async function POST(request: NextRequest) {

    const body: RequestBody = (await request.json()) as RequestBody;

    body.password = await bcrypt.hash(body.password, 12);

    const data = await createUser(body);


        if (!data) {
            return NextResponse.json({ error: "Could not create user" }, { status: 500 });
        }

        if (data) {
            return NextResponse.json(data, {status: 201});
        }


    }



