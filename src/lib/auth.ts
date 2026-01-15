import {cookies} from "next/headers";
import {AUTH_COOKIE_NAME} from "@/lib/authCookies";
import {Principal, verifyAuthToken} from "@/lib/jwt";


export async function getAuthentication(): Promise<Principal | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }
  return await verifyAuthToken(token);
}
