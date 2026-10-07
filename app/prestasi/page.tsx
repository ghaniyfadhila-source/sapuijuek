import type { Metadata } from "next";
import Image from "next/image";
import { getAnonClient } from "@/lib/supabase/db";
import type { Achievement } from "@/lib/validation/achievement";

export const metadata: Metadata = { title: "Prestasi Kelas" };

export const dynamic = "force-dynamic";

export default async function PrestasiPage() {
  const supabase = getAnonClient();

  const [{ data: achievements, error: achievementsError }, { data: settingsRows }] =
    await Promise.all([
      supabase.from("achievements").select("*").order("tanggal", { ascending: false }),
      supabase.from("site_settings").select("key, value"),
    ]);

  const achievementsList = (achievements ?? []) as Achievement[];
  const settings = new Map(
    (settingsRows ?? []).map((r) => [r.key as string, r.value as string]),
  );

  const tagline = settings.get("prestasi_tagline") || "Prestasi Gemilang Kelas PPLG";

  function formatDate(dateStr: string) {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <section className="glass rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold">Galeri Prestasi</h1>
        <p className="mt-2 text-slate-600">{tagline}</p>
        <div className="mt-6">
          <span className="block text-3xl font-bold text-brand">{achievementsList.length}</span>
          <span className="text-slate-600">Prestasi Terdaftar</span>
        </div>
        {achievementsError && (
          <p className="mt-4 text-sm text-red-600">
            Gagal memuat data prestasi. Coba muat ulang halaman.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Daftar Prestasi</h2>
        {achievementsList.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-slate-600">
            Belum ada data prestasi.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {achievementsList.map((a) => (
              <article
                key={a.id}
                className="glass group flex flex-col rounded-2xl p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/15"
              >
                {a.bukti_url && (
                  <div className="mb-4 overflow-hidden rounded-xl">
                    <Image
                      src={a.bukti_url}
                      alt={`Bukti ${a.judul}`}
                      width={400}
                      height={225}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-lg line-clamp-2">{a.judul}</h3>
                <p className="mt-2 text-sm text-slate-600">{formatDate(a.tanggal)}</p>
                {a.deskripsi && (
                  <p className="mt-3 flex-1 text-sm text-slate-700 line-clamp-3">{a.deskripsi}</p>
                )}
                {a.member_ids && a.member_ids.length > 0 && (
                  <div className="mt-4 flex items-center gap-1.5">
                    <span className="text-xs text-slate-500">Anggota:</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft text-primary px-2 py-0.5 text-xs">
                      {a.member_ids.length} orang
                    </span>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}