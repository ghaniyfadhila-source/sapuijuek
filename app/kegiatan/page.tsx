import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Kegiatan" };

export default function KegiatanPage() {
  return (
    <PlaceholderPage
      title="Galeri Kegiatan"
      description="Dokumentasi foto kegiatan kelas PPLG: study tour, workshop, gathering, dan team building."
    />
  );
}
