"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/components/nav-config";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function NavLinks() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <ul className="hidden items-center gap-1 lg:flex">
        {navLinks.map((l) => {
          const active = isActive(pathname, l.href);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "bg-white/20 text-white"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
        className="inline-flex size-11 items-center justify-center rounded-xl text-white transition-colors duration-200 hover:bg-white/10 active:bg-white/20 lg:hidden"
      >
        {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
      </button>

      {/* Mobile panel */}
      <div
        id="menu-mobile"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-white/10 bg-[#111844]/95 shadow-lg backdrop-blur-2xl lg:hidden"
      >
        <ul className="mx-auto grid max-w-6xl gap-1 px-4 py-3">
          {navLinks.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center rounded-xl px-4 text-base font-medium transition-colors duration-200 ${
                    active
                      ? "bg-white/20 text-white"
                      : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
