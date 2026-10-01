import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16">
      <div className="glass mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 rounded-t-2xl px-4 py-6 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo kelas PPLG" width={28} height={28} className="rounded-md" />
          <span>© 2026 Kelas PPLG SMKN 9 Semarang</span>
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          <li>
            <Link href="/profil" className="transition-colors hover:text-brand">
              Profil
            </Link>
          </li>
          <li>
            <Link href="/kontak" className="transition-colors hover:text-brand">
              Kontak
            </Link>
          </li>
          <li>
            <Link href="/admin" className="transition-colors hover:text-brand">
              Admin
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
