import type { Metadata } from "next";
import { getAnonClient } from "@/lib/supabase/db";
import KegiatanClient from "./KegiatanClient";

export const metadata: Metadata = { title: "Galeri Kegiatan" };

export const dynamic = "force-dynamic";

export default async function KegiatanPage() {
  const supabase = getAnonClient();

  const [{ data: activities }, { data: settingsRows }] = await Promise.all([
    supabase.from("activities").select("*").order("tanggal", { ascending: false }),
    supabase.from("site_settings").select("key, value"),
  ]);

  const settings = new Map(
    (settingsRows ?? []).map((r) => [r.key as string, r.value as string]),
  );

  const tagline = settings.get("kegiatan_tagline") || "Momen Bersama Kelas PPLG";

  return <KegiatanClient initialActivities={activities ?? []} tagline={tagline} />;
}