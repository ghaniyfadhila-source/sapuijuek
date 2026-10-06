/**
 * Logika verifikasi session admin — murni, tanpa network, bisa di-unit test.
 */

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const part = token.split(".")[1];
  if (!part) return null;
  try {
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
    return JSON.parse(atob(b64 + pad)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Token dianggap valid jika struktur JWT benar dan `exp` masih di masa depan. */
export function isValidSessionToken(
  token: string | null | undefined,
  now: number = Date.now(),
): boolean {
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;
  return payload.exp * 1000 > now;
}

/**
 * Guard path: `/admin` dan semua turunannya butuh login,
 * kecuali subtree `/admin/login`.
 */
export function isProtectedAdminPath(pathname: string): boolean {
  if (pathname === "/admin" || pathname === "/admin/") return true;
  if (!pathname.startsWith("/admin/")) return false;
  return !pathname.startsWith("/admin/login");
}
