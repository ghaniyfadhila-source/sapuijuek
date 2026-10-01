import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  return (
    <PlaceholderPage
      title="Portfolio Karya"
      description="Showcase karya siswa kelas PPLG: aplikasi, game, desain, lengkap dengan demo dan penjelasan teknis."
    />
  );
}
