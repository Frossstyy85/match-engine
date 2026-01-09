"use server"

import { SignJWT, jwtVerify } from "jose";
import { AUTH_TOKEN_MAX_AGE_SECONDS } from "@/lib/authCookies";

export type Principal = {
  sub: string;
  roles: string[]
};

function getJwtSecret(): Uint8Array {
  const secret: string = "secret";
  return new TextEncoder().encode(secret);
}

export async function signAuthToken(userId: string, roles: string[]): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({
    roles
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setIssuedAt(now)
    .setExpirationTime(now + AUTH_TOKEN_MAX_AGE_SECONDS)
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string): Promise<Principal | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (!payload.sub || !payload.roles) return null;
    return {
      sub: payload.sub,
      roles: payload.roles as string[]
    };
  } catch {
    return null;
  }
}


