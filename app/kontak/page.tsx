import type { Metadata } from "next";
import { getAnonClient } from "@/lib/supabase/db";
import KontakClient from "./KontakClient";

export const metadata: Metadata = { title: "Kontak" };

export const dynamic = "force-dynamic";

export default async function KontakPage() {
  const supabase = getAnonClient();

  const { data: settingsRows } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["kontak_email", "kontak_instagram", "kontak_whatsapp", "kontak_tiktok", "kontak_youtube", "tagline"]);

  const settings: Record<string, string> = {};
  for (const row of (settingsRows ?? []) as { key: string; value: string }[]) {
    settings[row.key] = row.value;
  }

  return <KontakClient initialSettings={settings} />;
}