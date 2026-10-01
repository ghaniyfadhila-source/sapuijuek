import type { Metadata } from "next";
import "./globals.css";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "Kelas PPLG SMKN 9 Semarang",
    template: "%s | Kelas PPLG SMKN 9 Semarang",
  },
  description:
    "Portal digital kelas PPLG (Pengembangan Perangkat Lunak dan Gim) SMKN 9 Semarang — profil kelas, prestasi, portofolio karya, dan dokumentasi kegiatan.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col">
        <SiteNavbar />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
