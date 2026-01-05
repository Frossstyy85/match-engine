import { NextResponse } from "next/server";
import { clearedSessionCookie } from "@/lib/authCookies";

export async function POST(req) {
  const res = NextResponse.json({ message: "logged out" }, { status: 200 });
  res.cookies.set(clearedSessionCookie);
  return res;
}
