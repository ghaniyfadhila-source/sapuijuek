"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  organizationSchema,
  type Organization,
  type OrganizationInput,
} from "@/lib/validation/organization";

const PER_PAGE = 20;

type ListResponse = {
  data: Organization[];
  count: number;
  page: number;
  perPage: number;
};

const emptyForm: OrganizationInput = {
  posisi: "",
  urutan: 0,
  member_id: "",
};

const POSISI_DEFAULT = [
  "Ketua Kelas",
  "Wakil Ketua Kelas",
  "Sekretaris",
  "Bendahara",
  "Ketua Bidang Akademik",
  "Ketua Bidang Kesiswaan",
  "Ketua Bidang Pramuka",
  "Ketua Bidang Rohis",
  "Ketua Bidang Olahraga",
  "Ketua Bidang Seni",
];

export default function AdminStrukturPage() {
  const [org, setOrg] = useState<Organization[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Organization | null>(null);
  const [form, setForm] = useState<OrganizationInput>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState<{ id: string; nama: string; nis: string; kelas_paralel: string; foto_url: string; kontak: string; created_at: string }[]>([]);

  const totalPages = Math.max(1, Math.ceil(count / PER_PAGE));

  const load = useCallback(async (p: number, term: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), perPage: String(PER_PAGE) });
      if (term) params.set("q", term);
      const res = await fetch(`/api/organization?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal memuat data struktur");
      const json = (await res.json()) as ListResponse;
      setOrg(json.data);
      setCount(json.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/members?perPage=100");
      if (!res.ok) throw new Error("Gagal memuat data anggota");
      const json = (await res.json()) as { data: { id: string; nama: string; nis: string; kelas_paralel: string; foto_url: string; kontak: string; created_at: string }[] };
      setMembers(json.data);
    } catch (err) {
      console.error("Load members failed:", err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    async function fetchInitialData() {
      await loadMembers();
      if (mounted) await load(page, q);
    }
    fetchInitialData();
    return () => { mounted = false; };
  }, [page, q, load, loadMembers]);

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

  function openEdit(item: Organization) {
    setEditing(item);
    setForm({
      posisi: item.posisi,
      urutan: item.urutan ?? 0,
      member_id: item.member_id,
    });
    setFormError(null);
    setShowForm(true);
  }

  async function submitForm() {
    setFormError(null);
    const parsed = organizationSchema.safeParse(form);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Input tidak valid");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/organization/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        const json = (await res.json().catch(() => null)) as { data?: Organization; error?: string } | null;
        if (!res.ok || !json?.data) throw new Error(json?.error ?? "Gagal mengubah struktur");
        setNotice(`Posisi "${parsed.data.posisi}" diperbarui.`);
      } else {
        const res = await fetch("/api/organization", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        const json = (await res.json().catch(() => null)) as { data?: Organization; error?: string } | null;
        if (!res.ok || !json?.data) throw new Error(json?.error ?? "Gagal menambah struktur");
        setNotice(`Posisi "${parsed.data.posisi}" ditambahkan.`);
      }
      setShowForm(false);
      load(page, q);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  async function deleteOrg(item: Organization) {
    if (!window.confirm(`Hapus posisi "${item.posisi}"?`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/organization/${item.id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(json?.error ?? "Gagal menghapus struktur");
      }
      setNotice(`Posisi "${item.posisi}" dihapus.`);
      load(page, q);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kelola Struktur Organisasi</h1>
          <p className="text-sm text-slate-600">
            {count} posisi terdaftar
          </p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          + Tambah Posisi
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applySearch()}
          placeholder="Cari posisi atau nama anggota..."
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
      ) : org.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-slate-600">
          {q ? "Tidak ada posisi yang cocok dengan pencarian." : "Belum ada struktur organisasi. Klik \"+ Tambah Posisi\" untuk memulai."}
        </div>
      ) : (
        <div className="glass overflow-x-auto rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Posisi</th>
                <th className="px-4 py-3 font-medium">Anggota</th>
                <th className="px-4 py-3 font-medium">Kelas</th>
                <th className="px-4 py-3 font-medium">Urutan</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {org.map((o, idx) => (
                <tr key={o.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 text-slate-600">
                    {(page - 1) * PER_PAGE + idx + 1}
                  </td>
                  <td className="px-4 py-3 font-medium">{o.posisi}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {o.foto_url ? (
                        <Image src={o.foto_url} alt={o.nama || ""} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-500">
                          {(o.nama || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>{o.nama || "-"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{o.kelas_paralel || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{o.urutan ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(o)} className="mr-2 rounded-lg px-3 py-1.5 text-brand hover:bg-brand/10">
                      Ubah
                    </button>
                    <button onClick={() => deleteOrg(o)} className="rounded-lg px-3 py-1.5 text-red-600 hover:bg-red-50">
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
          <div className="glass max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white/95 p-6">
            <h2 className="text-xl font-bold">{editing ? "Ubah Posisi" : "Tambah Posisi"}</h2>
            <form onSubmit={(e) => { e.preventDefault(); submitForm(); }} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Posisi / Jabatan</label>
                <input
                  required
                  list="posisi-options"
                  value={form.posisi}
                  onChange={(e) => setForm({ ...form, posisi: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
                />
                <datalist id="posisi-options">
                  {POSISI_DEFAULT.map((p) => <option key={p} value={p} />)}
                </datalist>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Urutan Tampil (angka, semakin kecil semakin atas)</label>
                <input
                  type="number"
                  min="0"
                  value={form.urutan}
                  onChange={(e) => setForm({ ...form, urutan: Number(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Anggota</label>
                <select
                  required
                  value={form.member_id}
                  onChange={(e) => setForm({ ...form, member_id: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
                >
                  <option value="">Pilih anggota</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama} ({m.nis}) - {m.kelas_paralel}
                    </option>
                  ))}
                </select>
                {members.length === 0 && <p className="mt-1 text-xs text-slate-500">Belum ada data anggota. Tambah di menu Anggota dulu.</p>}
              </div>

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