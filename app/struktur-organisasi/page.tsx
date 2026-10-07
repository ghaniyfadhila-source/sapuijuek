import type { Metadata } from "next";
import Image from "next/image";
import { getAnonClient } from "@/lib/supabase/db";
import type { Organization } from "@/lib/validation/organization";

export const metadata: Metadata = { title: "Struktur Organisasi" };

export const dynamic = "force-dynamic";

export default async function StrukturPage() {
  const supabase = getAnonClient();

  const [{ data: org }, { data: settingsRows }] = await Promise.all([
    supabase
      .from("organization")
      .select("*, members!inner(nama, foto_url, kelas_paralel)")
      .order("urutan", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase.from("site_settings").select("key, value"),
  ]);

  const settings = new Map(
    (settingsRows ?? []).map((r) => [r.key as string, r.value as string]),
  );

  const tagline = settings.get("struktur_tagline") || "Pengurus Kelas PPLG";

  // Flatten
  type OrgRow = {
    id: string;
    posisi: string;
    urutan: number;
    member_id: string;
    created_at: string;
    members?: { nama: string; foto_url: string; kelas_paralel: string } | null;
  };
  const orgList: Organization[] = ((org ?? []) as OrgRow[]).map((row) => ({
    ...row,
    nama: row.members?.nama,
    foto_url: row.members?.foto_url,
    kelas_paralel: row.members?.kelas_paralel,
  }));

  // Group by level (simple: Ketua/Wakil = level 1, others = level 2)
  const level1 = orgList.filter((o) =>
    /ketua|wakil/i.test(o.posisi)
  );
  const level2 = orgList.filter((o) =>
    !/ketua|wakil/i.test(o.posisi)
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <section className="glass rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold">Struktur Organisasi Kelas</h1>
        <p className="mt-2 text-slate-600">{tagline}</p>
        <div className="mt-6">
          <span className="block text-3xl font-bold text-brand">{orgList.length}</span>
          <span className="text-slate-600">Pengurus</span>
        </div>
      </section>

      {level1.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Kepala Kelas</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 justify-center max-w-4xl mx-auto">
            {level1.map((o) => (
              <article key={o.id} className="glass flex flex-col items-center rounded-2xl p-6 text-center">
                <div className="relative size-28">
                  {o.foto_url ? (
                    <Image
                      src={o.foto_url}
                      alt={o.nama || ""}
                      fill
                      className="object-cover rounded-full ring-4 ring-white shadow-lg"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200 text-5xl text-slate-400">
                      {(o.nama || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="mt-4 font-semibold text-lg">{o.nama || "-"}</h3>
                <p className="text-sm text-brand font-medium">{o.posisi}</p>
                <p className="mt-1 text-xs text-slate-500">{o.kelas_paralel || ""}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {level2.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Bidang & Koordinator</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {level2.map((o) => (
              <article key={o.id} className="glass flex flex-col items-center rounded-2xl p-5 text-center">
                <div className="relative size-20">
                  {o.foto_url ? (
                    <Image
                      src={o.foto_url}
                      alt={o.nama || ""}
                      fill
                      className="object-cover rounded-full ring-2 ring-white shadow"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200 text-3xl text-slate-400">
                      {(o.nama || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="mt-3 font-medium text-sm">{o.nama || "-"}</h3>
                <p className="text-xs text-slate-600 truncate max-w-[120px]">{o.posisi}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">{o.kelas_paralel || ""}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {orgList.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center text-slate-600">
          Belum ada data struktur organisasi.
        </div>
      )}
    </div>
  );
}