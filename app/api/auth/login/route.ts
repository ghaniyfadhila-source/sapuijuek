import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/auth/login-schema";
import { buildAuthCookies } from "@/lib/auth/cookies";
import { ensureAdminExists } from "@/lib/supabase/admin";

type GrantResult =
  | { ok: true; accessToken: string; refreshToken: string; expiresIn: number }
  | { ok: false; status: number };

async function passwordGrant(
  url: string,
  anonKey: string,
  email: string,
  password: string,
): Promise<GrantResult> {
  const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = (await res.json().catch(() => null)) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  } | null;
  if (!res.ok || !data?.access_token || !data.refresh_token) {
    return { ok: false, status: res.status };
  }
  return {
    ok: true,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in ?? 3600,
  };
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Input tidak valid" },
      { status: 400 },
    );
  }
  const { email, password } = parsed.data;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return NextResponse.json(
      { error: "Konfigurasi Supabase belum lengkap" },
      { status: 500 },
    );
  }

  let grant = await passwordGrant(url, anonKey, email, password);

  // Seed otomatis: login pertama dengan kredensial env ADMIN_EMAIL/ADMIN_PASSWORD
  // membuat akun admin di Supabase Auth (email_confirm=true) lalu dicoba ulang.
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (
    !grant.ok &&
    adminEmail &&
    adminPassword &&
    email === adminEmail.trim().toLowerCase() &&
    password === adminPassword
  ) {
    try {
      await ensureAdminExists(adminEmail.trim().toLowerCase(), adminPassword);
      grant = await passwordGrant(url, anonKey, email, password);
    } catch (err) {
      console.error("Seed admin gagal:", err);
    }
  }

  if (!grant.ok) {
    return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  for (const c of buildAuthCookies(grant.accessToken, grant.refreshToken, grant.expiresIn)) {
    res.cookies.set(c.name, c.value, c.options);
  }
  return res;
}
