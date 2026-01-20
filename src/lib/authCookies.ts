export const AUTH_COOKIE_NAME = "sessionId";
export const AUTH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24;

export const sessionCookieOptions = {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    maxAge: AUTH_TOKEN_MAX_AGE_SECONDS,
    secure: false
};

export const clearedSessionCookie = {
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    sameSite: "strict" as const,
    secure: false,
    maxAge: 0,
};


