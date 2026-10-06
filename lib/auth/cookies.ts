export const ACCESS_COOKIE = "sb-access-token";
export const REFRESH_COOKIE = "sb-refresh-token";

export function authCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export function buildAuthCookies(
  accessToken: string,
  refreshToken: string,
  expiresInSeconds: number,
) {
  return [
    { name: ACCESS_COOKIE, value: accessToken, options: authCookieOptions(expiresInSeconds) },
    { name: REFRESH_COOKIE, value: refreshToken, options: authCookieOptions(expiresInSeconds) },
  ] as const;
}
