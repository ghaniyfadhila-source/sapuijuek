"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Phone, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type FormData = {
  nama: string;
  email: string;
  subjek: string;
  pesan: string;
};

type Settings = {
  kontak_email?: string;
  kontak_instagram?: string;
  kontak_whatsapp?: string;
  kontak_tiktok?: string;
  kontak_youtube?: string;
  tagline?: string;
};

type Props = {
  initialSettings: Settings;
};

export default function KontakClient({ initialSettings }: Props) {
  const [form, setForm] = useState<FormData>({ nama: "", email: "", subjek: "", pesan: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: "Gagal mengirim" }));
        throw new Error(json.error);
      }
      setSubmitStatus("success");
      setSubmitMessage("Pesan berhasil dikirim! Kami akan segera merespons.");
      setForm({ nama: "", email: "", subjek: "", pesan: "" });
    } catch (err) {
      setSubmitStatus("error");
      setSubmitMessage(err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi nanti.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (submitStatus !== "idle") setSubmitStatus("idle");
  }

  const settings = initialSettings;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <section className="glass rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold">Hubungi Kami</h1>
        <p className="mt-2 text-slate-600">
          {settings.tagline || "Kelas PPLG SMKN 9 Semarang"}
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <section className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Kirim Pesan</h2>

          {(submitStatus === "success" || submitStatus === "error") && (
            <div
              className={`mb-6 rounded-xl p-4 flex items-center gap-3 ${
                submitStatus === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {submitStatus === "success" ? (
                <CheckCircle className="size-5 shrink-0" />
              ) : (
                <AlertCircle className="size-5 shrink-0" />
              )}
              <p className="text-sm">{submitMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="nama" className="mb-1 block text-sm font-medium">Nama Lengkap</label>
              <input
                id="nama"
                name="nama"
                required
                value={form.nama}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
              />
            </div>
            <div>
              <label htmlFor="subjek" className="mb-1 block text-sm font-medium">Subjek</label>
              <input
                id="subjek"
                name="subjek"
                required
                value={form.subjek}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
              />
            </div>
            <div>
              <label htmlFor="pesan" className="mb-1 block text-sm font-medium">Pesan</label>
              <textarea
                id="pesan"
                name="pesan"
                required
                rows={5}
                value={form.pesan}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-brand px-6 py-3 font-medium text-white hover:bg-brand-dark disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="size-5" />
                  Kirim Pesan
                </>
              )}
            </button>
          </form>
        </section>

        {/* Info Kontak */}
        <section className="glass rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold">Informasi Kontak</h2>

          <div className="space-y-4">
            {settings.kontak_email && (
              <a href={`mailto:${settings.kontak_email}`} className="flex items-center gap-3 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Mail className="size-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium">{settings.kontak_email}</p>
                </div>
              </a>
            )}
            {settings.kontak_whatsapp && (
              <a href={`https://wa.me/${settings.kontak_whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
                  <Phone className="size-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">WhatsApp</p>
                  <p className="font-medium">{settings.kontak_whatsapp}</p>
                </div>
              </a>
            )}
            {settings.kontak_instagram && (
              <a href={`https://instagram.com/${settings.kontak_instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10 text-pink-600">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg" alt="" width={20} height={20} className="size-5" unoptimized />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Instagram</p>
                  <p className="font-medium">@{settings.kontak_instagram.replace("@", "")}</p>
                </div>
              </a>
            )}
            {settings.kontak_tiktok && (
              <a href={`https://tiktok.com/@${settings.kontak_tiktok.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/10 text-black">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tiktok.svg" alt="" width={20} height={20} className="size-5" unoptimized />
                </div>
                <div>
                  <p className="text-sm text-slate-500">TikTok</p>
                  <p className="font-medium">@{settings.kontak_tiktok.replace("@", "")}</p>
                </div>
              </a>
            )}
            {settings.kontak_youtube && (
              <a href={`https://youtube.com/${settings.kontak_youtube}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10 text-red-600">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtube.svg" alt="" width={20} height={20} className="size-5" unoptimized />
                </div>
                <div>
                  <p className="text-sm text-slate-500">YouTube</p>
                  <p className="font-medium">{settings.kontak_youtube}</p>
                </div>
              </a>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Atau kunjungi kami di:
            </p>
            <p className="mt-1 text-sm font-medium">SMKN 9 Semarang</p>
            <p className="text-sm text-slate-500">Jl. Ahmad Yani No. 69, Semarang, Jawa Tengah</p>
          </div>
        </section>
      </div>
    </div>
  );
}