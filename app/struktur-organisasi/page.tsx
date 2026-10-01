import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Struktur Organisasi" };

export default function StrukturOrganisasiPage() {
  return (
    <PlaceholderPage
      title="Struktur Organisasi"
      description="Bagan organisasi kelas PPLG: ketua, wakil, sekretaris, bendahara, beserta foto dan nama pengurus."
    />
  );
}
