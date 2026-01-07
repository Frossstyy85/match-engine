import { SignJWT, jwtVerify } from "jose";
import { Role } from "@/lib/types";
import { AUTH_TOKEN_MAX_AGE_SECONDS } from "@/lib/authCookies";

export type JwtUser = {
  sub: string;
  role: Role
};

function getJwtSecret(): Uint8Array {
  const secret: string = "secret";
  return new TextEncoder().encode(secret);
}

export async function signAuthToken(userId: string, role: Role = "user"): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setIssuedAt(now)
    .setExpirationTime(now + AUTH_TOKEN_MAX_AGE_SECONDS)
    .sign(getJwtSecret());
};

export async function verifyAuthToken(token: string): Promise<JwtUser | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (!payload.sub || !payload.role) return null;
    return {
      sub: payload.sub,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}


