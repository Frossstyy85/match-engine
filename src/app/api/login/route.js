import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import userService from "@/services/userService";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_MAX_AGE_SECONDS, sessionCookieOptions } from "@/lib/authCookies";
import { signAuthToken } from "@/lib/jwt";


export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "missing fields" }, { status: 400 });
    }

    const credentials = await userService.findUserCredentials(email);

    if (!credentials) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, credentials.password_hash);

    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = await signAuthToken(credentials.id, AUTH_TOKEN_MAX_AGE_SECONDS);

    const res = NextResponse.json({ message: "Login successful" }, { status: 200 });

    res.cookies.set(AUTH_COOKIE_NAME, token, sessionCookieOptions);

    return res;
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
