import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/prestasi", label: "Prestasi" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/kegiatan", label: "Kegiatan" },
  { href: "/struktur-organisasi", label: "Struktur" },
  { href: "/kontak", label: "Kontak" },
];

export function SiteNavbar() {
  return (
    <header className="glass sticky top-0 z-50">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo kelas PPLG"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="text-sm font-semibold sm:text-base">
            Kelas PPLG SMKN 9 Semarang
          </span>
        </Link>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-slate-600 transition-colors hover:text-brand"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
