"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Trophy, FolderKanban, ImageIcon, MessageSquare, Settings, LayoutDashboard } from "lucide-react";

type Stats = {
  members: number;
  achievements: number;
  projects: number;
  activities: number;
  contacts: number;
  newContacts: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    members: 0,
    achievements: 0,
    projects: 0,
    activities: 0,
    contacts: 0,
    newContacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [m, a, p, act, c] = await Promise.all([
          fetch("/api/members?perPage=1").then((r) => r.json()),
          fetch("/api/achievements?perPage=1").then((r) => r.json()),
          fetch("/api/projects?perPage=1").then((r) => r.json()),
          fetch("/api/activities?perPage=1").then((r) => r.json()),
          fetch("/api/admin/contact?perPage=1").then((r) => r.json()),
        ]);
        setStats({
          members: m.count ?? 0,
          achievements: a.count ?? 0,
          projects: p.count ?? 0,
          activities: act.count ?? 0,
          contacts: c.count ?? 0,
          newContacts: c.data?.filter((x: any) => x.status === "baru").length ?? 0,
        });
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { title: "Anggota Kelas", count: stats.members, icon: Users, href: "/admin/anggota", color: "bg-blue-500", bg: "bg-blue-500/10" },
    { title: "Prestasi", count: stats.achievements, icon: Trophy, href: "/admin/prestasi", color: "bg-amber-500", bg: "bg-amber-500/10" },
    { title: "Portfolio / Karya", count: stats.projects, icon: FolderKanban, href: "/admin/portfolio", color: "bg-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Galeri Kegiatan", count: stats.activities, icon: ImageIcon, href: "/admin/kegiatan", color: "bg-pink-500", bg: "bg-pink-500/10" },
    { title: "Pesan Kontak", count: stats.contacts, icon: MessageSquare, href: "/admin/kontak", color: "bg-violet-500", bg: "bg-violet-500/10", badge: stats.newContacts > 0 ? stats.newContacts : null, badgeLabel: "Baru" },
    { title: "Pengaturan", count: 0, icon: Settings, href: "/admin/pengaturan", color: "bg-slate-500", bg: "bg-slate-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <p className="text-sm text-slate-600">Selamat datang! Kelola konten website Kelas PPLG di sini.</p>
        </div>
        <Link href="/admin/anggota" className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
          <span className="flex items-center gap-1.5">
            <Users className="size-4" />
            Kelola Anggota
          </span>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse space-y-3">
              <div className="h-4 w-1/4 bg-slate-200 rounded" />
              <div className="h-8 w-1/2 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {cards.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="glass group flex flex-col rounded-2xl p-6 transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/15"
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg}`}>
                  <c.icon className={`size-5 ${c.color}`} />
                </div>
                {c.badge !== null && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                    {c.badge}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{c.count}</p>
                <p className="mt-1 text-sm text-slate-600">{c.title}</p>
                {c.badgeLabel && <p className="mt-1 text-xs text-red-600 font-medium">{c.badgeLabel}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}

      <section className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Akses Cepat</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/anggota" className="flex items-center gap-3 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <Users className="size-5" />
            </div>
            <div>
              <p className="font-medium">Kelola Anggota</p>
              <p className="text-sm text-slate-500">Tambah, edit, hapus anggota kelas</p>
            </div>
          </Link>
          <Link href="/admin/prestasi" className="flex items-center gap-3 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Trophy className="size-5" />
            </div>
            <div>
              <p className="font-medium">Kelola Prestasi</p>
              <p className="text-sm text-slate-500">Tambah prestasi dengan bukti foto</p>
            </div>
          </Link>
          <Link href="/admin/portfolio" className="flex items-center gap-3 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <FolderKanban className="size-5" />
            </div>
            <div>
              <p className="font-medium">Kelola Portfolio</p>
              <p className="text-sm text-slate-500">Karya siswa: gambar, video, demo link</p>
            </div>
          </Link>
          <Link href="/admin/kegiatan" className="flex items-center gap-3 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10 text-pink-600">
              <ImageIcon className="size-5" />
            </div>
            <div>
              <p className="font-medium">Kelola Kegiatan</p>
              <p className="text-sm text-slate-500">Album foto dengan lightbox</p>
            </div>
          </Link>
          <Link href="/admin/struktur" className="flex items-center gap-3 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600">
              <LayoutDashboard className="size-5" />
            </div>
            <div>
              <p className="font-medium">Struktur Organisasi</p>
              <p className="text-sm text-slate-500">Posisi pengurus & urutan tampil</p>
            </div>
          </Link>
          <Link href="/admin/kontak" className="flex items-center gap-3 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-600">
              <MessageSquare className="size-5" />
            </div>
            <div>
              <p className="font-medium">Pesan Kontak</p>
              <p className="text-sm text-slate-500">Lihat & kelola pesan masuk</p>
            </div>
          </Link>
          <Link href="/admin/pengaturan" className="flex items-center gap-3 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-500/10 text-slate-600">
              <Settings className="size-5" />
            </div>
            <div>
              <p className="font-medium">Pengaturan Website</p>
              <p className="text-sm text-slate-500">Visi Misi, tagline, kontak sosial</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}