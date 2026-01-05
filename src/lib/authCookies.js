export const AUTH_COOKIE_NAME = "auth";
export const AUTH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24;

export const sessionCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "strict",
  maxAge: AUTH_TOKEN_MAX_AGE_SECONDS,
  secure: process.env.NODE_ENV === "production",
};

export const clearedSessionCookie = {
  name: AUTH_COOKIE_NAME,
  value: "",
  httpOnly: true,
  sameSite: "strict",
  path: "/",
  maxAge: -1,
};


