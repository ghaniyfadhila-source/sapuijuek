"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  achievementSchema,
  type Achievement,
  type AchievementInput,
} from "@/lib/validation/achievement";

const PER_PAGE = 12;

type ListResponse = {
  data: Achievement[];
  count: number;
  page: number;
  perPage: number;
};

const emptyForm: AchievementInput = {
  judul: "",
  tanggal: new Date().toISOString().split("T")[0],
  deskripsi: "",
  bukti_url: "",
  member_ids: [],
};

export default function AdminPrestasiPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [form, setForm] = useState<AchievementInput>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const totalPages = Math.max(1, Math.ceil(count / PER_PAGE));

  const load = useCallback(async (p: number, term: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), perPage: String(PER_PAGE) });
      if (term) params.set("q", term);
      const res = await fetch(`/api/achievements?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal memuat data prestasi");
      const json = (await res.json()) as ListResponse;
      setAchievements(json.data);
      setCount(json.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load() memanggil setState, pola standar data fetching
    load(page, q);
  }, [page, q, load]);

  function applySearch() {
    setPage(1);
    setQ(searchInput.trim());
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setPhotoFile(null);
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(achievement: Achievement) {
    setEditing(achievement);
    setForm({
      judul: achievement.judul,
      tanggal: achievement.tanggal,
      deskripsi: achievement.deskripsi ?? "",
      bukti_url: achievement.bukti_url ?? "",
      member_ids: achievement.member_ids ?? [],
    });
    setPhotoFile(null);
    setFormError(null);
    setShowForm(true);
  }

  async function submitForm() {
    setFormError(null);
    const parsed = achievementSchema.safeParse(form);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Input tidak valid");
      return;
    }
    setSaving(true);
    try {
      let achievementId: string;
      if (editing) {
        const res = await fetch(`/api/achievements/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        const json = (await res.json().catch(() => null)) as { data?: Achievement; error?: string } | null;
        if (!res.ok || !json?.data) throw new Error(json?.error ?? "Gagal mengubah prestasi");
        achievementId = json.data.id;
        setNotice(`Prestasi "${parsed.data.judul}" diperbarui.`);
      } else {
        const res = await fetch("/api/achievements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        const json = (await res.json().catch(() => null)) as { data?: Achievement; error?: string } | null;
        if (!res.ok || !json?.data) throw new Error(json?.error ?? "Gagal menambah prestasi");
        achievementId = json.data.id;
        setNotice(`Prestasi "${parsed.data.judul}" ditambahkan.`);
      }

      if (photoFile) {
        const fd = new FormData();
        fd.set("file", photoFile);
        const res = await fetch(`/api/achievements/${achievementId}/photo`, { method: "POST", body: fd });
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        if (!res.ok) throw new Error(json?.error ?? "Upload foto gagal");
      }

      setShowForm(false);
      load(page, q);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAchievement(achievement: Achievement) {
    if (!window.confirm(`Hapus prestasi "${achievement.judul}"? Tindakan ini tidak bisa dibatalkan.`)) {
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/achievements/${achievement.id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(json?.error ?? "Gagal menghapus prestasi");
      }
      setNotice(`Prestasi "${achievement.judul}" dihapus.`);
      load(page, q);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  }

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
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kelola Prestasi</h1>
          <p className="text-sm text-slate-600">
            {count} prestasi terdaftar
          </p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          + Tambah Prestasi
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applySearch()}
          placeholder="Cari judul atau deskripsi..."
          className="w-full max-w-sm rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
        />
        <button
          onClick={applySearch}
          className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-300"
        >
          Cari
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}
      {notice && (
        <p className="mb-4 rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">{notice}</p>
      )}

      {loading ? (
        <p className="py-10 text-center text-slate-500">Memuat...</p>
      ) : achievements.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-slate-600">
          {q ? "Tidak ada prestasi yang cocok dengan pencarian." : "Belum ada prestasi. Klik \"+ Tambah Prestasi\" untuk memulai."}
        </div>
      ) : (
        <div className="glass overflow-x-auto rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="px-4 py-3 font-medium">Bukti</th>
                <th className="px-4 py-3 font-medium">Judul</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Deskripsi</th>
                <th className="px-4 py-3 font-medium">Anggota Terlibat</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {achievements.map((a) => (
                <tr key={a.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    {a.bukti_url ? (
                      <Image
                        src={a.bukti_url}
                        alt={`Bukti ${a.judul}`}
                        width={60}
                        height={60}
                        className="h-15 w-15 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-15 w-15 items-center justify-center rounded-lg bg-slate-200 text-xs text-slate-500">
                        Tidak ada foto
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium max-w-xs truncate">{a.judul}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatDate(a.tanggal)}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-md truncate">{a.deskripsi || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {a.member_ids && a.member_ids.length > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft text-primary px-2 py-0.5 text-xs">
                        {a.member_ids.length} anggota
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(a)}
                      className="mr-2 rounded-lg px-3 py-1.5 text-brand hover:bg-brand/10"
                    >
                      Ubah
                    </button>
                    <button
                      onClick={() => deleteAchievement(a)}
                      className="rounded-lg px-3 py-1.5 text-red-600 hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-xl bg-slate-200 px-4 py-2 font-medium hover:bg-slate-300 disabled:opacity-40"
          >
            Sebelumnya
          </button>
          <span className="text-slate-600">
            Halaman {page} dari {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-xl bg-slate-200 px-4 py-2 font-medium hover:bg-slate-300 disabled:opacity-40"
          >
            Berikutnya
          </button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 px-4">
          <div className="glass max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white/95 p-6">
            <h2 className="text-xl font-bold">
              {editing ? "Ubah Prestasi" : "Tambah Prestasi"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitForm();
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="mb-1 block text-sm font-medium">Judul Prestasi</label>
                <input
                  required
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Tanggal (YYYY-MM-DD)</label>
                <input
                  required
                  type="date"
                  value={form.tanggal}
                  onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Deskripsi (opsional)</label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">URL Bukti Foto (opsional)</label>
                <input
                  value={form.bukti_url}
                  onChange={(e) => setForm({ ...form, bukti_url: e.target.value })}
                  placeholder="https://example.com/bukti.jpg (atau upload di bawah)"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Upload Foto Bukti {editing && !photoFile && "(kosongkan jika tidak diganti)"}
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm"
                />
                <p className="mt-1 text-xs text-slate-500">JPG/PNG/WebP, maks 5MB</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Anggota Terlibat (opsional)</label>
                <input
                  value={JSON.stringify(form.member_ids)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      if (Array.isArray(parsed)) setForm({ ...form, member_ids: parsed });
                    } catch {
                      // ignore invalid JSON
                    }
                  }}
                  placeholder='["uuid1", "uuid2"]'
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
                />
                <p className="mt-1 text-xs text-slate-500">Array UUID anggota (dapat diisi lewat admin anggota)</p>
              </div>
              {formError && (
                <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{formError}</p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}