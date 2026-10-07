import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/components/nav-config";

const linkClass =
  "rounded-md text-muted-foreground transition-colors duration-200 hover:text-primary";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-slate-900/10 bg-white/60 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt=""
              width={36}
              height={36}
              className="rounded-lg ring-1 ring-slate-900/10"
            />
            <span className="font-display font-semibold">Kelas PPLG SMKN 9 Semarang</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
            Portal digital kelas Pengembangan Perangkat Lunak dan Gim — wadah
            identitas, prestasi, dan karya terbaik siswa.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">Jelajahi</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.slice(1, 5).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">Kelas</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/struktur-organisasi" className={linkClass}>
                Struktur Organisasi
              </Link>
            </li>
            <li>
              <Link href="/kontak" className={linkClass}>
                Kontak
              </Link>
            </li>
            <li>
              <Link href="/admin" className={linkClass}>
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-900/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-sm text-muted-foreground">
          © 2026 Kelas PPLG SMKN 9 Semarang
        </p>
      </div>
    </footer>
  );
}
