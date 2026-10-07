"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  activitySchema,
  type Activity,
  type ActivityInput,
} from "@/lib/validation/activity";

const PER_PAGE = 12;

type ListResponse = {
  data: Activity[];
  count: number;
  page: number;
  perPage: number;
};

const emptyForm: ActivityInput = {
  nama_acara: "",
  tanggal: new Date().toISOString().split("T")[0],
  deskripsi: "",
  photos: [],
};

export default function AdminKegiatanPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [form, setForm] = useState<ActivityInput>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const totalPages = Math.max(1, Math.ceil(count / PER_PAGE));

  const load = useCallback(async (p: number, term: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), perPage: String(PER_PAGE) });
      if (term) params.set("q", term);
      const res = await fetch(`/api/activities?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal memuat data kegiatan");
      const json = (await res.json()) as ListResponse;
      setActivities(json.data);
      setCount(json.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(page, q);
  }, [page, q, load]);

  function applySearch() {
    setPage(1);
    setQ(searchInput.trim());
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(activity: Activity) {
    setEditing(activity);
    setForm({
      nama_acara: activity.nama_acara,
      tanggal: activity.tanggal,
      deskripsi: activity.deskripsi ?? "",
      photos: activity.photos ?? [],
    });
    setFormError(null);
    setShowForm(true);
  }

  async function submitForm() {
    setFormError(null);
    const parsed = activitySchema.safeParse(form);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Input tidak valid");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/activities/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        const json = (await res.json().catch(() => null)) as { data?: Activity; error?: string } | null;
        if (!res.ok || !json?.data) throw new Error(json?.error ?? "Gagal mengubah kegiatan");
        setNotice(`Kegiatan "${parsed.data.nama_acara}" diperbarui.`);
      } else {
        const res = await fetch("/api/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        const json = (await res.json().catch(() => null)) as { data?: Activity; error?: string } | null;
        if (!res.ok || !json?.data) throw new Error(json?.error ?? "Gagal menambah kegiatan");
        setNotice(`Kegiatan "${parsed.data.nama_acara}" ditambahkan.`);
      }
      setShowForm(false);
      load(page, q);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoUpload(activityId: string, files: FileList) {
    if (!files.length) return;
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      const res = await fetch(`/api/activities/${activityId}/photos`, { method: "POST", body: fd });
      const json = (await res.json().catch(() => null)) as { photos?: string[]; error?: string } | null;
      if (!res.ok || !json?.photos) throw new Error(json?.error ?? "Upload foto gagal");
      setNotice(`${json.photos.length} foto ditambahkan.`);
      load(page, q);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Upload gagal");
    }
  }

  async function deletePhotos(activityId: string, urls: string[]) {
    if (!urls.length) return;
    if (!window.confirm(`Hapus ${urls.length} foto?`)) return;
    setFormError(null);
    try {
      const res = await fetch(`/api/activities/${activityId}/photos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      const json = (await res.json().catch(() => null)) as { photos?: string[]; error?: string } | null;
      if (!res.ok) throw new Error(json?.error ?? "Gagal menghapus foto");
      setNotice(`${urls.length} foto dihapus.`);
      load(page, q);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menghapus foto");
    }
  }

  async function deleteActivity(activity: Activity) {
    if (!window.confirm(`Hapus kegiatan "${activity.nama_acara}"? Tindakan ini tidak bisa dibatalkan.`)) {
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/activities/${activity.id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(json?.error ?? "Gagal menghapus kegiatan");
      }
      setNotice(`Kegiatan "${activity.nama_acara}" dihapus.`);
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
          <h1 className="text-2xl font-bold">Kelola Galeri Kegiatan</h1>
          <p className="text-sm text-slate-600">
            {count} album kegiatan terdaftar
          </p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          + Tambah Kegiatan
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applySearch()}
          placeholder="Cari nama acara atau deskripsi..."
          className="w-full max-w-sm rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
        />
        <button onClick={applySearch} className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-300">
          Cari
        </button>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
      {notice && <p className="mb-4 rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">{notice}</p>}

      {loading ? (
        <p className="py-10 text-center text-slate-500">Memuat...</p>
      ) : activities.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-slate-600">
          {q ? "Tidak ada kegiatan yang cocok dengan pencarian." : "Belum ada kegiatan. Klik \"+ Tambah Kegiatan\" untuk memulai."}
        </div>
      ) : (
        <div className="glass overflow-x-auto rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="px-4 py-3 font-medium">Cover</th>
                <th className="px-4 py-3 font-medium">Nama Acara</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Jumlah Foto</th>
                <th className="px-4 py-3 font-medium">Deskripsi</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    {a.photos?.length ? (
                      <Image src={a.photos[0]} alt={a.nama_acara} width={80} height={60} className="h-15 w-20 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-15 w-20 items-center justify-center rounded-lg bg-slate-200 text-xs text-slate-500">Tidak ada</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium max-w-xs truncate">{a.nama_acara}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatDate(a.tanggal)}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft text-primary px-2 py-0.5 text-xs">
                      {a.photos?.length || 0} foto
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-md truncate">{a.deskripsi || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(a)} className="mr-2 rounded-lg px-3 py-1.5 text-brand hover:bg-brand/10">
                      Ubah
                    </button>
                    <button onClick={() => deleteActivity(a)} className="rounded-lg px-3 py-1.5 text-red-600 hover:bg-red-50">
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
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-xl bg-slate-200 px-4 py-2 font-medium hover:bg-slate-300 disabled:opacity-40">
            Sebelumnya
          </button>
          <span className="text-slate-600">Halaman {page} dari {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="rounded-xl bg-slate-200 px-4 py-2 font-medium hover:bg-slate-300 disabled:opacity-40">
            Berikutnya
          </button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 px-4">
          <div className="glass max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white/95 p-6">
            <h2 className="text-xl font-bold">{editing ? "Ubah Kegiatan" : "Tambah Kegiatan"}</h2>
            <form onSubmit={(e) => { e.preventDefault(); submitForm(); }} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Nama Acara</label>
                <input required value={form.nama_acara} onChange={(e) => setForm({ ...form, nama_acara: e.target.value })} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Tanggal (YYYY-MM-DD)</label>
                <input required type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Deskripsi (opsional)</label>
                <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={3} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Foto Kegiatan</label>
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => { const files = e.target.files; if (files?.length && editing) handlePhotoUpload(editing.id, files); }} className="w-full text-sm" disabled={!editing} />
                <p className="mt-1 text-xs text-slate-500">JPG/PNG/WebP, maks 5MB per file. Upload foto setelah menyimpan kegiatan.</p>
              </div>

              {editing && form.photos.length > 0 && (
                <div>
                  <label className="mb-1 block text-sm font-medium">Foto Tersimpan</label>
                  <div className="grid gap-2 sm:grid-cols-4">
                    {form.photos.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square">
                        <Image src={img} alt="" fill className="object-cover rounded-lg" sizes="200px" />
                        <button type="button" onClick={() => deletePhotos(editing!.id, [img])} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white transition-opacity">
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formError && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{formError}</p>}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-300">Batal</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60">
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