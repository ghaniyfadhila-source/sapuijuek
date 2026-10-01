import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Prestasi" };

export default function PrestasiPage() {
  return (
    <PlaceholderPage
      title="Prestasi Kelas"
      description="Daftar lengkap prestasi akademik dan non-akademik siswa kelas PPLG beserta buktinya."
    />
  );
}
