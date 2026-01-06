import {cookies} from "next/headers";
import {AUTH_COOKIE_NAME} from "@/lib/authCookies";
import {verifyAuthToken} from "@/lib/jwt";
import userService from "@/lib/services/userService";

interface Authentication {
  id: number,
  role?: string,
}

export async function getAuthentication(): Promise<Authentication | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyAuthToken(token);
  if (!payload) {
    return null;
  }

  const userId = Number(payload.sub);

  return {
    id: userId
  };
}

export async function getCurrentUser(){
  const auth = await getAuthentication();
  if (auth){
    return await userService.getUserWithProfile(auth.id);
  }
  throw new Error("no authentication")
}
