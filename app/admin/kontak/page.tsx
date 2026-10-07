"use client";

import { useCallback, useEffect, useState } from "react";
import { type ContactMessage } from "@/lib/validation/contact";

const PER_PAGE = 20;

type ListResponse = {
  data: ContactMessage[];
  count: number;
  page: number;
  perPage: number;
};

const STATUS_LABELS = {
  baru: { label: "Baru", className: "bg-blue-50 text-blue-700" },
  dibaca: { label: "Dibaca", className: "bg-amber-50 text-amber-700" },
  diarsipkan: { label: "Diarsipkan", className: "bg-slate-50 text-slate-700" },
};

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function truncate(str: string, len: number) {
  return str.length > len ? str.slice(0, len) + "..." : str;
}

export default function AdminKontakPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(count / PER_PAGE));

  const load = useCallback(async (p: number, term: string, statusFilter: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), perPage: String(PER_PAGE) });
      if (term) params.set("q", term);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/contact?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal memuat pesan kontak");
      const json = (await res.json()) as ListResponse;
      setMessages(json.data);
      setCount(json.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(page, q, status);
  }, [page, q, status, load]);

  function applySearch() {
    setPage(1);
    setQ(searchInput.trim());
  }

  function applyStatusFilter() {
    setPage(1);
    setStatus(statusFilter);
  }

  async function updateStatus(id: string, newStatus: ContactMessage["status"]) {
    setError(null);
    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(json?.error ?? "Gagal mengubah status");
      }
      setNotice(`Status diperbarui menjadi ${STATUS_LABELS[newStatus].label}.`);
      load(page, q, status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  }

  async function deleteMessage(msg: ContactMessage) {
    if (!window.confirm(`Hapus pesan dari "${msg.nama}"?`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/contact/${msg.id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(json?.error ?? "Gagal menghapus pesan");
      }
      setNotice(`Pesan dari "${msg.nama}" dihapus.`);
      load(page, q, status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kelola Pesan Kontak</h1>
          <p className="text-sm text-slate-600">
            {count} pesan total
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applySearch()}
          placeholder="Cari nama, email, subjek, atau pesan..."
          className="w-full max-w-sm rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
        />
        <button onClick={applySearch} className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-300">
          Cari
        </button>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyStatusFilter()}
          className="w-auto rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
        >
          <option value="">Semua Status</option>
          <option value="baru">Baru</option>
          <option value="dibaca">Dibaca</option>
          <option value="diarsipkan">Diarsipkan</option>
        </select>
        <button onClick={applyStatusFilter} className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-300">
          Filter
        </button>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
      {notice && <p className="mb-4 rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">{notice}</p>}

      {loading ? (
        <p className="py-10 text-center text-slate-500">Memuat...</p>
      ) : messages.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-slate-600">
          {q || statusFilter ? "Tidak ada pesan yang cocok dengan filter." : "Belum ada pesan masuk."}
        </div>
      ) : (
        <div className="glass overflow-x-auto rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="px-4 py-3 font-medium">Waktu</th>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Subjek</th>
                <th className="px-4 py-3 font-medium">Pesan</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600">{formatDate(m.created_at)}</td>
                  <td className="px-4 py-3 font-medium max-w-xs truncate">{m.nama}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{m.email}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{m.subjek}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-md truncate">{truncate(m.pesan, 80)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_LABELS[m.status].className}`}>
                      {STATUS_LABELS[m.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={m.status}
                      onChange={(e) => updateStatus(m.id, e.target.value as ContactMessage["status"])}
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/35"
                    >
                      <option value="baru">Baru</option>
                      <option value="dibaca">Dibaca</option>
                      <option value="diarsipkan">Diarsipkan</option>
                    </select>
                    <button onClick={() => deleteMessage(m)} className="ml-2 rounded-lg px-3 py-1.5 text-red-600 hover:bg-red-50">
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
    </div>
  );
}