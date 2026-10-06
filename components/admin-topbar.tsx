"use client";

import { useRouter } from "next/navigation";

export function AdminTopbar() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="glass sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <span className="text-sm font-semibold sm:text-base">
          Panel Admin — Kelas PPLG SMKN 9 Semarang
        </span>
        <button
          onClick={logout}
          className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
