import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard Admin" };

export default function AdminDashboardPage() {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <h1 className="text-3xl font-bold">Dashboard Admin</h1>
      <p className="mt-3 text-slate-600">
        Selamat datang. Statistik dan ringkasan konten akan tampil di sini
        setelah modul konten (prestasi, portfolio, kegiatan) selesai dibangun.
      </p>
    </div>
  );
}
