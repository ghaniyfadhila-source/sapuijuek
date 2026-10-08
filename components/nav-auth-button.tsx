"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, LogOut } from "lucide-react";

const btnBase =
  "inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors duration-200 sm:text-sm";

/**
 * Tombol kecil pojok kanan navbar.
 * - Halaman publik → "Masuk" (tautan ke /admin/login)
 * - Panel admin (/admin/*, kecuali halaman login) → "Keluar"
 *   (proxy memastikan hanya user ter-autentikasi yang sampai di sini,
 *   jadi tidak perlu cek sesi di klien)
 * - /admin/login → disembunyikan (sudah di halaman login)
 */
export function NavAuthButton() {
  const pathname = usePathname();
  const router = useRouter();

  const onLoginPage = pathname === "/admin/login";
  const onAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (onLoginPage) return null;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (onAdmin) {
    return (
      <button
        type="button"
        onClick={logout}
        className={`${btnBase} border-red-400/30 bg-red-600 text-white hover:bg-red-700`}
      >
        <LogOut className="size-3.5" aria-hidden />
        Keluar
      </button>
    );
  }

  return (
    <Link
      href="/admin/login"
      className={`${btnBase} border-white/25 bg-white/10 text-white hover:bg-white/20`}
    >
      <LogIn className="size-3.5" aria-hidden />
      Masuk
    </Link>
  );
}
