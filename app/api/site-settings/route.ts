import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/verify";
import { getAnonClient, getServiceClient } from "@/lib/supabase/db";
import { siteSettingsKeys, settingsSchema } from "@/lib/validation/siteSettings";

type SettingsRow = { key: string; value: string };

export async function GET() {
  const supabase = getAnonClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", siteSettingsKeys);
  if (error) {
    return NextResponse.json({ error: "Gagal mengambil pengaturan" }, { status: 500 });
  }
  const settings: Record<string, string> = {};
  for (const row of (data ?? []) as SettingsRow[]) {
    settings[row.key] = row.value;
  }
  // Ensure all keys present
  for (const k of siteSettingsKeys) {
    if (!(k in settings)) settings[k] = "";
  }
  return NextResponse.json({ data: settings });
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Input tidak valid" },
      { status: 400 },
    );
  }

  const supabase = getServiceClient();
  const updates = Object.entries(parsed.data).map(([key, value]) =>
    supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })
  );
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed) {
    return NextResponse.json({ error: "Gagal menyimpan pengaturan" }, { status: 500 });
  }
  return NextResponse.json({ data: parsed.data });
}