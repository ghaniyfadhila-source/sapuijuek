import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Profil Kelas" };

export default function ProfilPage() {
  return (
    <PlaceholderPage
      title="Profil Kelas"
      description="Visi & misi, daftar lengkap anggota kelas, informasi guru pembimbing, dan statistik kelas PPLG."
    />
  );
}
