import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE } from "./cookies";
import { isValidSessionToken } from "./session";

/**
 * Verifikasi session admin di server: cookie JWT valid + masih dikenali
 * Supabase Auth (/auth/v1/user). Dipakai semua route yang menulis data.
 */
export async function isAdminAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ACCESS_COOKIE)?.value;
  if (!isValidSessionToken(token)) return false;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return false;

  try {
    const res = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Return null jika admin valid, atau response 401 jika tidak. */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  if (await isAdminAuthenticated(req)) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
