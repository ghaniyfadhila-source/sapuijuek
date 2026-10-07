import Image from "next/image";
import Link from "next/link";
import { NavLinks } from "@/components/nav-links";

export function SiteNavbar() {
  return (
    <header className="glass-strong sticky top-0 z-50">
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
            className="rounded-lg ring-1 ring-slate-900/10"
          />
          <span className="font-display text-sm font-semibold leading-tight text-foreground sm:text-base">
            Kelas PPLG
            <span className="block text-xs font-medium text-muted-foreground sm:inline sm:text-base sm:font-semibold sm:text-foreground">
              <span className="hidden sm:inline"> </span>SMKN 9 Semarang
            </span>
          </span>
        </Link>
        <NavLinks />
      </nav>
    </header>
  );
}
