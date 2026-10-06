import type { Metadata } from "next";
import Image from "next/image";
import { getAnonClient } from "@/lib/supabase/db";
import type { Member } from "@/lib/validation/member";

export const metadata: Metadata = { title: "Profil Kelas" };

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const supabase = getAnonClient();

  const [{ data: members, error: membersError }, { data: settingsRows }] =
    await Promise.all([
      supabase.from("members").select("*").order("nama", { ascending: true }),
      supabase.from("site_settings").select("key, value"),
    ]);

  const membersList = (members ?? []) as Member[];
  const settings = new Map(
    (settingsRows ?? []).map((r) => [r.key as string, r.value as string]),
  );

  const tagline = settings.get("tagline") || "Kelas PPLG SMKN 9 Semarang";
  const deskripsi = settings.get("deskripsi_kelas") || "";
  const guru = settings.get("guru_pembimbing") || "";
  const jumlahSiswa = membersList.length;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <section className="glass rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold">Profil Kelas</h1>
        <p className="mt-2 text-slate-600">{tagline}</p>
        {deskripsi && <p className="mt-4 mx-auto max-w-2xl text-slate-700">{deskripsi}</p>}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
          <div>
            <span className="block text-3xl font-bold text-brand">{jumlahSiswa}</span>
            <span className="text-slate-600">Siswa</span>
          </div>
          {guru && (
            <div>
              <span className="block text-lg font-semibold">{guru}</span>
              <span className="text-slate-600">Guru Pembimbing</span>
            </div>
          )}
        </div>
        {membersError && (
          <p className="mt-4 text-sm text-red-600">
            Gagal memuat data anggota. Coba muat ulang halaman.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Daftar Anggota</h2>
        {membersList.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-slate-600">
            Data anggota belum tersedia.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {membersList.map((m) => (
              <div key={m.id} className="glass flex flex-col items-center rounded-2xl p-4 text-center">
                {m.foto_url ? (
                  <Image
                    src={m.foto_url}
                    alt={`Foto ${m.nama}`}
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 text-3xl text-slate-400">
                    {m.nama.charAt(0).toUpperCase()}
                  </div>
                )}
                <p className="mt-3 font-semibold">{m.nama}</p>
                <p className="text-sm text-slate-600">{m.kelas_paralel}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}