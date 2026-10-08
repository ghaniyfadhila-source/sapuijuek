import Image from "next/image";
import Link from "next/link";
import { NavLinks } from "@/components/nav-links";

export function SiteNavbar() {
  return (
    <header className="glass-dark sticky top-0 z-50">
      <nav
        aria-label="Navigasi utama"
        className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5"
      >
        <Link href="/" className="flex items-center gap-2.5 rounded-xl py-1 pr-2">
          <Image
            src="/logo.png"
            alt=""
            width={36}
            height={36}
            className="rounded-lg ring-1 ring-white/25"
          />
          <span className="font-display text-sm font-semibold leading-tight text-white sm:text-base">
            Kelas PPLG
            <span className="block text-xs font-medium text-slate-300 sm:inline sm:text-base sm:font-semibold sm:text-white">
              <span className="hidden sm:inline"> </span>SMKN 9 Semarang
            </span>
          </span>
        </Link>
        <NavLinks />
      </nav>
    </header>
  );
}
