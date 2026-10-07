import type { Metadata } from "next";
import { Open_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

// Font pairing dari ui-ux-pro-max: Poppins (heading) + Open Sans (body)
const heading = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const body = Open_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

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
    <html lang="id" className={`${heading.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#konten"
          className="sr-only rounded-xl bg-primary px-4 py-2 font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
        >
          Lewati ke konten utama
        </a>
        <SiteNavbar />
        <div id="konten" className="flex-1">
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
