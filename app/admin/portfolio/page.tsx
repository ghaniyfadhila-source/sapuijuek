"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  projectSchema,
  type Project,
  type ProjectInput,
} from "@/lib/validation/project";

const PER_PAGE = 12;

type ListResponse = {
  data: Project[];
  count: number;
  page: number;
  perPage: number;
};

const emptyForm: ProjectInput = {
  judul: "",
  jenis_karya: "",
  deskripsi: "",
  tim_member_ids: [],
  images: [],
  video_url: "",
  demo_url: "",
};

const JENIS_KARYA = [
  "Aplikasi Web",
  "Aplikasi Mobile",
  "Game",
  "Desain UI/UX",
  "IoT / Embedded",
  "Lainnya",
];

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [q, setQ] = useState("");
  const [jenis, setJenis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectInput>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const totalPages = Math.max(1, Math.ceil(count / PER_PAGE));

  const load = useCallback(async (p: number, term: string, jenisFilter: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), perPage: String(PER_PAGE) });
      if (term) params.set("q", term);
      if (jenisFilter) params.set("jenis", jenisFilter);
      const res = await fetch(`/api/projects?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal memuat data karya");
      const json = (await res.json()) as ListResponse;
      setProjects(json.data);
      setCount(json.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(page, q, jenis);
  }, [page, q, jenis, load]);

  function applySearch() {
    setPage(1);
    setQ(searchInput.trim());
  }

  function applyJenisFilter() {
    setPage(1);
    setJenis(jenisFilter);
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    setForm({
      judul: project.judul,
      jenis_karya: project.jenis_karya,
      deskripsi: project.deskripsi ?? "",
      tim_member_ids: project.tim_member_ids ?? [],
      images: project.images ?? [],
      video_url: project.video_url ?? "",
      demo_url: project.demo_url ?? "",
    });
    setFormError(null);
    setShowForm(true);
  }

  async function submitForm() {
    setFormError(null);
    const parsed = projectSchema.safeParse(form);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Input tidak valid");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/projects/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        const json = (await res.json().catch(() => null)) as { data?: Project; error?: string } | null;
        if (!res.ok || !json?.data) throw new Error(json?.error ?? "Gagal mengubah karya");
        setNotice(`Karya "${parsed.data.judul}" diperbarui.`);
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        const json = (await res.json().catch(() => null)) as { data?: Project; error?: string } | null;
        if (!res.ok || !json?.data) throw new Error(json?.error ?? "Gagal menambah karya");
        setNotice(`Karya "${parsed.data.judul}" ditambahkan.`);
      }
      setShowForm(false);
      load(page, q, jenis);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(projectId: string, files: FileList) {
    if (!files.length) return;
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      const res = await fetch(`/api/projects/${projectId}/images`, { method: "POST", body: fd });
      const json = (await res.json().catch(() => null)) as { images?: string[]; error?: string } | null;
      if (!res.ok || !json?.images) throw new Error(json?.error ?? "Upload gambar gagal");
      setNotice(`${json.images.length} gambar ditambahkan.`);
      load(page, q, jenis);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Upload gagal");
    }
  }

  async function deleteImages(projectId: string, urls: string[]) {
    if (!urls.length) return;
    if (!window.confirm(`Hapus ${urls.length} gambar?`)) return;
    setFormError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/images`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      const json = (await res.json().catch(() => null)) as { images?: string[]; error?: string } | null;
      if (!res.ok) throw new Error(json?.error ?? "Gagal menghapus gambar");
      setNotice(`${urls.length} gambar dihapus.`);
      load(page, q, jenis);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menghapus gambar");
    }
  }

  async function deleteProject(project: Project) {
    if (!window.confirm(`Hapus karya "${project.judul}"? Tindakan ini tidak bisa dibatalkan.`)) {
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(json?.error ?? "Gagal menghapus karya");
      }
      setNotice(`Karya "${project.judul}" dihapus.`);
      load(page, q, jenis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kelola Portfolio / Karya</h1>
          <p className="text-sm text-slate-600">
            {count} karya terdaftar
          </p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          + Tambah Karya
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applySearch()}
          placeholder="Cari judul, deskripsi, atau jenis..."
          className="w-full max-w-sm rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
        />
        <button onClick={applySearch} className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-300">
          Cari
        </button>

        <select
          value={jenisFilter}
          onChange={(e) => setJenisFilter(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyJenisFilter()}
          className="w-auto rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
        >
          <option value="">Semua Jenis</option>
          {JENIS_KARYA.map((j) => (
            <option key={j} value={j}>{j}</option>
          ))}
        </select>
        <button onClick={applyJenisFilter} className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-300">
          Filter
        </button>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
      {notice && <p className="mb-4 rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">{notice}</p>}

      {loading ? (
        <p className="py-10 text-center text-slate-500">Memuat...</p>
      ) : projects.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-slate-600">
          {q || jenis ? "Tidak ada karya yang cocok dengan filter." : "Belum ada karya. Klik \"+ Tambah Karya\" untuk memulai."}
        </div>
      ) : (
        <div className="glass overflow-x-auto rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="px-4 py-3 font-medium">Thumbnail</th>
                <th className="px-4 py-3 font-medium">Judul</th>
                <th className="px-4 py-3 font-medium">Jenis</th>
                <th className="px-4 py-3 font-medium">Tim</th>
                <th className="px-4 py-3 font-medium">Media</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    {p.images?.length ? (
                      <Image src={p.images[0]} alt={p.judul} width={80} height={60} className="h-15 w-20 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-15 w-20 items-center justify-center rounded-lg bg-slate-200 text-xs text-slate-500">Tidak ada</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium max-w-xs truncate">{p.judul}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft text-primary px-2 py-0.5 text-xs">{p.jenis_karya}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {p.tim_member_ids && p.tim_member_ids.length > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft text-accent-strong px-2 py-0.5 text-xs">
                        {p.tim_member_ids.length} anggota
                      </span>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="inline-flex items-center gap-1 text-xs">
                      {p.images?.length || 0} img
                      {p.video_url && " • video"}
                      {p.demo_url && " • demo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="mr-2 rounded-lg px-3 py-1.5 text-brand hover:bg-brand/10">
                      Ubah
                    </button>
                    <button onClick={() => deleteProject(p)} className="rounded-lg px-3 py-1.5 text-red-600 hover:bg-red-50">
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
            <h2 className="text-xl font-bold">{editing ? "Ubah Karya" : "Tambah Karya"}</h2>
            <form onSubmit={(e) => { e.preventDefault(); submitForm(); }} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Judul Karya</label>
                <input required value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Jenis Karya</label>
                <select value={form.jenis_karya} onChange={(e) => setForm({ ...form, jenis_karya: e.target.value })} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35">
                  <option value="">Pilih jenis</option>
                  {JENIS_KARYA.map((j) => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Deskripsi</label>
                <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={4} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Tim Developer (Array UUID)</label>
                <input value={JSON.stringify(form.tim_member_ids)} onChange={(e) => { try { const parsed = JSON.parse(e.target.value); if (Array.isArray(parsed)) setForm({ ...form, tim_member_ids: parsed }); } catch {} }} placeholder='["uuid1", "uuid2"]' className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35" />
                <p className="mt-1 text-xs text-slate-500">Isi array UUID anggota</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">URL Video (YouTube/hosting, opsional)</label>
                <input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://youtube.com/..." className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">URL Demo Live (opsional)</label>
                <input value={form.demo_url} onChange={(e) => setForm({ ...form, demo_url: e.target.value })} placeholder="https://demo.example.com" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Gambar Karya</label>
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => { const files = e.target.files; if (files?.length && editing) handleImageUpload(editing.id, files); }} className="w-full text-sm" disabled={!editing} />
                <p className="mt-1 text-xs text-slate-500">JPG/PNG/WebP, maks 5MB per file. Upload gambar setelah menyimpan karya.</p>
              </div>

              {editing && form.images.length > 0 && (
                <div>
                  <label className="mb-1 block text-sm font-medium">Gambar Tersimpan</label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <Image src={img} alt="" width={200} height={150} className="w-full h-24 rounded-lg object-cover" />
                        <button type="button" onClick={() => deleteImages(editing!.id, [img])} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white transition-opacity">
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