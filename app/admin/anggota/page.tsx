"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { memberSchema, type Member, type MemberInput } from "@/lib/validation/member";

const PER_PAGE = 12;

type ListResponse = {
  data: Member[];
  count: number;
  page: number;
  perPage: number;
};

const emptyForm: MemberInput = {
  nama: "",
  nis: "",
  kelas_paralel: "",
  kontak: "",
};

export default function AdminAnggotaPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState<MemberInput>(emptyForm);
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
      const res = await fetch(`/api/members?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal memuat data anggota");
      const json = (await res.json()) as ListResponse;
      setMembers(json.data);
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

  function openEdit(member: Member) {
    setEditing(member);
    setForm({
      nama: member.nama,
      nis: member.nis,
      kelas_paralel: member.kelas_paralel,
      kontak: member.kontak ?? "",
    });
    setPhotoFile(null);
    setFormError(null);
    setShowForm(true);
  }

  async function submitForm() {
    setFormError(null);
    const parsed = memberSchema.safeParse(form);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Input tidak valid");
      return;
    }
    setSaving(true);
    try {
      let memberId: string;
      if (editing) {
        const res = await fetch(`/api/members/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        const json = (await res.json().catch(() => null)) as { data?: Member; error?: string } | null;
        if (!res.ok || !json?.data) throw new Error(json?.error ?? "Gagal mengubah anggota");
        memberId = json.data.id;
        setNotice(`Anggota "${parsed.data.nama}" diperbarui.`);
      } else {
        const res = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        const json = (await res.json().catch(() => null)) as { data?: Member; error?: string } | null;
        if (!res.ok || !json?.data) throw new Error(json?.error ?? "Gagal menambah anggota");
        memberId = json.data.id;
        setNotice(`Anggota "${parsed.data.nama}" ditambahkan.`);
      }

      if (photoFile) {
        const fd = new FormData();
        fd.set("file", photoFile);
        const res = await fetch(`/api/members/${memberId}/photo`, { method: "POST", body: fd });
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

  async function deleteMember(member: Member) {
    if (!window.confirm(`Hapus anggota "${member.nama}"? Tindakan ini tidak bisa dibatalkan.`)) {
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/members/${member.id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(json?.error ?? "Gagal menghapus anggota");
      }
      setNotice(`Anggota "${member.nama}" dihapus.`);
      load(page, q);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kelola Anggota</h1>
          <p className="text-sm text-slate-600">
            {count} anggota terdaftar
          </p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          + Tambah Anggota
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applySearch()}
          placeholder="Cari nama, NIS, atau kelas..."
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
      ) : members.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-slate-600">
          {q ? "Tidak ada anggota yang cocok dengan pencarian." : "Belum ada anggota. Klik \"+ Tambah Anggota\" untuk memulai."}
        </div>
      ) : (
        <div className="glass overflow-x-auto rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="px-4 py-3 font-medium">Foto</th>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">NIS</th>
                <th className="px-4 py-3 font-medium">Kelas</th>
                <th className="px-4 py-3 font-medium">Kontak</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    {m.foto_url ? (
                      <Image
                        src={m.foto_url}
                        alt={m.nama}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-500">
                        {m.nama.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{m.nama}</td>
                  <td className="px-4 py-3 text-slate-600">{m.nis}</td>
                  <td className="px-4 py-3 text-slate-600">{m.kelas_paralel}</td>
                  <td className="px-4 py-3 text-slate-600">{m.kontak || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(m)}
                      className="mr-2 rounded-lg px-3 py-1.5 text-brand hover:bg-brand/10"
                    >
                      Ubah
                    </button>
                    <button
                      onClick={() => deleteMember(m)}
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
          <div className="glass max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white/95 p-6">
            <h2 className="text-xl font-bold">
              {editing ? "Ubah Anggota" : "Tambah Anggota"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitForm();
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="mb-1 block text-sm font-medium">Nama Lengkap</label>
                <input
                  required
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">NIS (4-20 digit angka)</label>
                <input
                  required
                  inputMode="numeric"
                  value={form.nis}
                  onChange={(e) => setForm({ ...form, nis: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Kelas Paralel</label>
                <input
                  required
                  value={form.kelas_paralel}
                  onChange={(e) => setForm({ ...form, kelas_paralel: e.target.value })}
                  placeholder="contoh: XI-PPLG-1"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Kontak (opsional)</label>
                <input
                  value={form.kontak}
                  onChange={(e) => setForm({ ...form, kontak: e.target.value })}
                  placeholder="WA / email"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Foto {editing && !photoFile && "(kosongkan jika tidak diganti)"}
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm"
                />
                <p className="mt-1 text-xs text-slate-500">JPG/PNG/WebP, maks 5MB</p>
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