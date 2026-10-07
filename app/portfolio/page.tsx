import type { Metadata } from "next";
import Image from "next/image";
import { getAnonClient } from "@/lib/supabase/db";
import type { Project } from "@/lib/validation/project";

export const metadata: Metadata = { title: "Portfolio Karya" };

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const supabase = getAnonClient();

  const [{ data: projects, error: projectsError }, { data: settingsRows }] =
    await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("site_settings").select("key, value"),
    ]);

  const projectsList = (projects ?? []) as Project[];
  const settings = new Map(
    (settingsRows ?? []).map((r) => [r.key as string, r.value as string]),
  );

  const tagline = settings.get("portfolio_tagline") || "Karya-Karya Unggulan Siswa PPLG";

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <section className="glass rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold">Portfolio Karya Siswa</h1>
        <p className="mt-2 text-slate-600">{tagline}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
          <div>
            <span className="block text-3xl font-bold text-brand">{projectsList.length}</span>
            <span className="text-slate-600">Karya</span>
          </div>
        </div>
        {projectsError && (
          <p className="mt-4 text-sm text-red-600">Gagal memuat data karya.</p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Galeri Karya</h2>
        {projectsList.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-slate-600">
            Belum ada karya yang dipublikasikan.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projectsList.map((p) => (
              <article
                key={p.id}
                className="glass group flex flex-col rounded-2xl overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/15"
              >
                {p.images?.length ? (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={p.images[0]}
                      alt={p.judul}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {p.images.length > 1 && (
                      <div className="absolute top-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                        +{p.images.length - 1}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-slate-100 text-slate-400">
                    Tidak ada gambar
                  </div>
                )}
                <div className="flex-1 flex flex-col p-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary-soft text-primary px-2 py-0.5 text-xs font-medium">{p.jenis_karya}</span>
                  </div>
                  <h3 className="mt-2 font-semibold text-lg line-clamp-1">{p.judul}</h3>
                  {p.deskripsi && <p className="mt-3 flex-1 text-sm text-slate-700 line-clamp-3">{p.deskripsi}</p>}
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    {p.tim_member_ids && p.tim_member_ids.length > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft text-accent-strong px-2 py-0.5">
                        {p.tim_member_ids.length} dev
                      </span>
                    )}
                    {p.images && p.images.length > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-600 px-2 py-0.5">
                        {p.images.length} img
                      </span>
                    )}
                    {p.video_url && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-600 px-2 py-0.5">video</span>
                    )}
                    {p.demo_url && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-600 px-2 py-0.5">demo</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}