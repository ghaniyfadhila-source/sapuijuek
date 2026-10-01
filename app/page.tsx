import Link from "next/link";
import Image from "next/image";
import { GlassCard } from "@/components/glass-card";

const keunggulan = [
  {
    title: "Fokus Software & Game",
    description:
      "Kelas PPLG (Pengembangan Perangkat Lunak dan Gim) berlatih membuat aplikasi dan gim secara nyata.",
  },
  {
    title: "Portofolio Karya",
    description:
      "Setiap karya siswa — aplikasi, game, hingga desain — ditampilkan lengkap dengan demo dan penjelasan teknis.",
  },
  {
    title: "Prestasi & Kompetisi",
    description:
      "Rekam jejak prestasi akademik dan non-akademik kelas, dari lomba tingkat sekolah sampai nasional.",
  },
  {
    title: "Kerja Tim",
    description:
      "Proyek dikerjakan berbasis tim, meniru cara kerja tim pengembangan software profesional.",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-12 pt-16 text-center">
        <Image
          src="/logo.png"
          alt="Logo kelas PPLG"
          width={96}
          height={96}
          className="glass rounded-2xl"
        />
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Portal Digital Kelas PPLG
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Identitas, prestasi, dan karya-karya terbaik siswa kelas Pengembangan
          Perangkat Lunak dan Gim SMKN 9 Semarang.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/prestasi"
            className="rounded-xl bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-dark"
          >
            Lihat Prestasi
          </Link>
          <Link
            href="/portfolio"
            className="glass rounded-xl px-6 py-3 font-medium text-brand transition-colors hover:text-brand-dark"
          >
            Lihat Portfolio
          </Link>
          <Link
            href="/kontak"
            className="glass rounded-xl px-6 py-3 font-medium text-slate-700 transition-colors hover:text-brand"
          >
            Hubungi Kami
          </Link>
        </div>
      </section>

      {/* Keunggulan kelas */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {keunggulan.map((k) => (
            <GlassCard key={k.title} title={k.title} description={k.description} />
          ))}
        </div>
      </section>

      {/* Preview prestasi & karya */}
      <section className="mx-auto mt-16 grid max-w-6xl gap-4 px-4 md:grid-cols-2">
        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-semibold">Prestasi Terbaru</h2>
          <p className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            Belum ada data. Prestasi dikelola melalui panel admin.
          </p>
          <Link
            href="/prestasi"
            className="mt-4 inline-block text-sm font-medium text-brand hover:text-brand-dark"
          >
            Lihat semua prestasi →
          </Link>
        </div>
        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-semibold">Karya Terbaru</h2>
          <p className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            Belum ada data. Karya siswa dikelola melalui panel admin.
          </p>
          <Link
            href="/portfolio"
            className="mt-4 inline-block text-sm font-medium text-brand hover:text-brand-dark"
          >
            Lihat semua karya →
          </Link>
        </div>
      </section>

      {/* CTA admin */}
      <section className="mx-auto mt-16 max-w-6xl px-4 pb-8">
        <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-8">
          <div>
            <h2 className="text-lg font-semibold">Anggota kelas PPLG?</h2>
            <p className="mt-1 text-sm text-slate-600">
              Masuk ke panel admin untuk memperbarui prestasi, karya, dan
              dokumentasi kegiatan kelas.
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded-xl bg-brand px-5 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark"
          >
            Masuk Admin
          </Link>
        </div>
      </section>
    </main>
  );
}
