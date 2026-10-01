import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage() {
  return (
    <PlaceholderPage
      title="Panel Admin"
      description="Area khusus anggota kelas untuk mengelola seluruh konten website. Login admin menyusul."
    />
  );
}
