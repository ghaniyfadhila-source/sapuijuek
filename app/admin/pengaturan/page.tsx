"use client";

import { useEffect, useState } from "react";
import { type SettingsInput } from "@/lib/validation/siteSettings";

const initialForm: SettingsInput = {
  tagline: "",
  deskripsi_kelas: "",
  guru_pembimbing: "",
  tahun_berdiri: "",
  visi: "",
  misi: "",
  prestasi_tagline: "",
  portfolio_tagline: "",
  kegiatan_tagline: "",
  struktur_tagline: "",
  kontak_email: "",
  kontak_instagram: "",
  kontak_whatsapp: "",
  kontak_tiktok: "",
  kontak_youtube: "",
};

const fieldGroups = [
  {
    title: "Umum / Beranda",
    fields: [
      { key: "tagline", label: "Tagline Beranda", type: "text", placeholder: "Portal Digital Kelas PPLG SMKN 9 Semarang" },
      { key: "deskripsi_kelas", label: "Deskripsi Kelas", type: "textarea", placeholder: "Deskripsi singkat tentang kelas PPLG..." },
      { key: "guru_pembimbing", label: "Guru Pembimbing", type: "text", placeholder: "Nama guru pembimbing" },
      { key: "tahun_berdiri", label: "Tahun Berdiri", type: "text", placeholder: "2024" },
    ],
  },
  {
    title: "Visi & Misi",
    fields: [
      { key: "visi", label: "Visi", type: "textarea", placeholder: "Visi kelas PPLG..." },
      { key: "misi", label: "Misi", type: "textarea", placeholder: "Misi kelas PPLG (pisahkan dengan baris baru)..." },
    ],
  },
  {
    title: "Tagline Halaman",
    fields: [
      { key: "prestasi_tagline", label: "Tagline Halaman Prestasi", type: "text", placeholder: "Prestasi Gemilang Kelas PPLG" },
      { key: "portfolio_tagline", label: "Tagline Halaman Portfolio", type: "text", placeholder: "Karya-Karya Unggulan Siswa PPLG" },
      { key: "kegiatan_tagline", label: "Tagline Halaman Kegiatan", type: "text", placeholder: "Momen Bersama Kelas PPLG" },
      { key: "struktur_tagline", label: "Tagline Halaman Struktur", type: "text", placeholder: "Pengurus Kelas PPLG" },
    ],
  },
  {
    title: "Informasi Kontak",
    fields: [
      { key: "kontak_email", label: "Email Kelas", type: "email", placeholder: "pplg@smkn9.sch.id" },
      { key: "kontak_instagram", label: "Instagram", type: "text", placeholder: "@pplg_smkn9" },
      { key: "kontak_whatsapp", label: "WhatsApp", type: "text", placeholder: "6281234567890" },
      { key: "kontak_tiktok", label: "TikTok", type: "text", placeholder: "@pplg_smkn9" },
      { key: "kontak_youtube", label: "YouTube", type: "text", placeholder: "UCxxxxxx" },
    ],
  },
];

export default function AdminPengaturanPage() {
  const [form, setForm] = useState<SettingsInput>(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setError(null);
    try {
      const res = await fetch("/api/site-settings");
      if (!res.ok) throw new Error("Gagal memuat pengaturan");
      const json = (await res.json()) as { data: SettingsInput };
      setForm(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  }

  async function saveSettings() {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(json?.error ?? "Gagal menyimpan pengaturan");
      }
      setNotice("Pengaturan berhasil disimpan.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Pengaturan Website</h1>
        <p className="text-sm text-slate-600">
          Kelola konten statis website: tagline, visi misi, info kontak, dll.
        </p>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
      {notice && <p className="mb-4 rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">{notice}</p>}

      <form onSubmit={(e) => { e.preventDefault(); saveSettings(); }} className="space-y-8">
        {fieldGroups.map((group) => (
          <section key={group.title} className="glass rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
              {group.title}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.fields.map((f) => (
                <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                  <label className="mb-1 block text-sm font-medium">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea
                      value={form[f.key as keyof SettingsInput]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      rows={4}
                      placeholder={f.placeholder}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
                    />
                  ) : (
                    <input
                      type={f.type}
                      value={form[f.key as keyof SettingsInput]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={loadSettings}
            className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-300"
          >
            Batal (Muat Ulang)
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Semua"}
          </button>
        </div>
      </form>
    </div>
  );
}