import { SignJWT, jwtVerify } from "jose";
import { AUTH_TOKEN_MAX_AGE_SECONDS } from "@/lib/authCookies";



function getJwtSecret(): Uint8Array {
  const secret: string = "secret";
  return new TextEncoder().encode(secret);
}

export function signToken(userId: number, userRole: string){
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({
    role: userRole
  })
      .setProtectedHeader({ alg: "HS256"})
      .setSubject(userId.toString())
      .setIssuer("frosty")
      .setIssuedAt(now)
      .setExpirationTime(now + AUTH_TOKEN_MAX_AGE_SECONDS)
      .sign(getJwtSecret())
}

export async function verifyToken(token: string){
  const { payload } = await jwtVerify(token, getJwtSecret);
  return payload;
}