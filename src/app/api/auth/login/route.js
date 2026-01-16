import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_MAX_AGE_SECONDS, sessionCookieOptions } from "@/lib/authCookies";
import { signToken } from "@/lib/jwt";
import {getUserAuthByEmail} from "@/db/repositories/UserRepository";

export async function POST(req) {

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "missing fields" }, { status: 400 });
    }

    const userAuth = await getUserAuthByEmail(email);

    if (!userAuth) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, userAuth.password_hash);

    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken(userAuth.id, userAuth.role);

    const res = NextResponse.json({ message: "Login successful" }, { status: 200 });

    res.cookies.set(AUTH_COOKIE_NAME, token, sessionCookieOptions);

    return res;
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}