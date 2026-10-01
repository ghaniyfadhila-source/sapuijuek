import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Kontak" };

export default function KontakPage() {
  return (
    <PlaceholderPage
      title="Hubungi Kami"
      description="Formulir pesan dan informasi kontak kelas PPLG SMKN 9 Semarang."
    />
  );
}
