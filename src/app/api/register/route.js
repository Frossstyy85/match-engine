import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/authUtils";
import {createUser, emailExists} from "@/db/repositories/UserRepository";

export async function POST(req) {

  const body = await req.json();
  const { email, name, password } = body;


  if (!email || !password || !name) {
    return NextResponse.json({ message: "missing fields" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "Email Address is invalid" }, { status: 400 });
  }

  const taken = await emailExists(email);

  if (taken) {
    return NextResponse.json({ message: "Email already in use" }, { status: 409 });
  }

  const created = await createUser({
    name: name,
    email: email,
    password: password
  })

  if (!created) {
    return NextResponse.json({ message: "Error creating account" }, { status: 500 });
  }

  return NextResponse.json({ message: "Account created" }, { status: 200 });
}
