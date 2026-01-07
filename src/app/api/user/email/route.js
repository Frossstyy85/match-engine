import { isValidEmail } from "@/lib/authUtils";
import {NextResponse} from "next/server";

export default async function PATCH(req){
    const { email } = await req.json();

    if (!isValidEmail(email)) {
        return NextResponse.json({ error: "Invalid email address" })
    }


}