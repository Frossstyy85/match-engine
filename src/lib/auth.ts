"use server"
import {cookies} from "next/headers";
import {AUTH_COOKIE_NAME} from "@/lib/authCookies";
import {JwtUser, verifyAuthToken} from "@/lib/jwt";
import {findUser} from "@/db/repositories/UserRepository";


export async function getAuthentication(): Promise<JwtUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }
  return await verifyAuthToken(token);
}

export async function getUserProfile(){
  const payload = await getAuthentication();
  if (payload){
    return await findUser(Number(payload.sub))
  }
  throw new Error("no authentication")
}
