import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CodeXml,
  FolderKanban,
  Gamepad2,
  LogIn,
  MonitorSmartphone,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { HeroMockup } from "@/components/hero-mockup";

const fokus = [
  { label: "Aplikasi Web", icon: CodeXml },
  { label: "Aplikasi Mobile", icon: MonitorSmartphone },
  { label: "Gim", icon: Gamepad2 },
];

const alurTim = ["Perencanaan", "Pengembangan", "Review", "Rilis"];

function Chip({ children, icon: Icon }: { children: ReactNode; icon?: LucideIcon }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-900/10 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700">
      {Icon ? <Icon className="size-3.5 text-primary" aria-hidden /> : null}
      {children}
    </span>
  );
}

function EmptyState({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white/50 px-6 py-10 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-slate-900/5 text-slate-500">
        <Icon className="size-5" aria-hidden />
      </span>
      <p className="mt-4 font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground text-pretty">{text}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-x-clip">
        <div
          aria-hidden
          className="hero-aura pointer-events-none absolute inset-x-0 -top-24 h-[36rem]"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-24 lg:pt-24">
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-primary-dark shadow-sm backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              SMKN 9 Semarang · Kelas PPLG
            </p>

            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Dari baris kode menjadi{" "}
              <span className="text-primary">karya nyata</span>.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty lg:mx-0">
              Portal digital Kelas Pengembangan Perangkat Lunak dan Gim — kenali
              identitas kelas, ikuti prestasi, dan jelajahi aplikasi, gim, serta
              desain terbaik buatan siswa.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/portfolio"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-white shadow-lg shadow-primary/25 transition duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:translate-y-0"
              >
                Jelajahi Portfolio
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <Link
                href="/prestasi"
                className="glass inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 font-semibold text-foreground transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary-dark active:translate-y-0"
              >
                <Trophy className="size-4 text-accent-strong" aria-hidden />
                Lihat Prestasi
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start" aria-label="Fokus pembelajaran">
              {fokus.map((f) => (
                <li key={f.label}>
                  <Chip icon={f.icon}>{f.label}</Chip>
                </li>
              ))}
            </ul>
          </div>

          <HeroMockup />
        </div>
      </section>

      {/* Keunggulan kelas — bento grid */}
      <section aria-labelledby="judul-keunggulan" className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-strong">
            Kenapa PPLG
          </p>
          <h2 id="judul-keunggulan" className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Belajar seperti tim developer sungguhan
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <GlassCard
            className="md:col-span-2"
            icon={CodeXml}
            href="/profil"
            title="Fokus Software & Game"
            description="Kelas PPLG (Pengembangan Perangkat Lunak dan Gim) berlatih membuat aplikasi dan gim secara nyata."
          >
            <div className="flex flex-wrap gap-2">
              {fokus.map((f) => (
                <Chip key={f.label} icon={f.icon}>
                  {f.label}
                </Chip>
              ))}
            </div>
          </GlassCard>
          <GlassCard
            icon={FolderKanban}
            tone="accent"
            href="/portfolio"
            title="Portofolio Karya"
            description="Setiap karya siswa — aplikasi, game, hingga desain — ditampilkan lengkap dengan demo dan penjelasan teknis."
          />
          <GlassCard
            icon={Trophy}
            tone="accent"
            href="/prestasi"
            title="Prestasi & Kompetisi"
            description="Rekam jejak prestasi akademik dan non-akademik kelas, dari lomba tingkat sekolah sampai nasional."
          />
          <GlassCard
            className="md:col-span-2"
            icon={Users}
            href="/struktur-organisasi"
            title="Kerja Tim"
            description="Proyek dikerjakan berbasis tim, meniru cara kerja tim pengembangan software profesional."
          >
            <ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-700">
              {alurTim.map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-900/10 bg-white/70 px-3 py-1">
                    <span className="font-mono text-primary">{i + 1}</span>
                    {step}
                  </span>
                  {i < alurTim.length - 1 ? (
                    <ArrowRight className="size-3.5 text-slate-400" aria-hidden />
                  ) : null}
                </li>
              ))}
            </ol>
          </GlassCard>
        </div>
      </section>

      {/* Preview prestasi & karya */}
      <section aria-label="Pembaruan terbaru" className="mx-auto mt-20 grid max-w-6xl gap-4 px-4 md:grid-cols-2">
        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Prestasi Terbaru</h2>
            <Link
              href="/prestasi"
              className="group inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm font-medium text-primary transition-colors duration-200 hover:text-primary-dark"
            >
              Lihat semua
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
          <EmptyState
            icon={Trophy}
            title="Belum ada prestasi"
            text="Prestasi dikelola melalui panel admin."
          />
        </div>
        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Karya Terbaru</h2>
            <Link
              href="/portfolio"
              className="group inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm font-medium text-primary transition-colors duration-200 hover:text-primary-dark"
            >
              Lihat semua
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
          <EmptyState
            icon={FolderKanban}
            title="Belum ada karya"
            text="Karya siswa dikelola melalui panel admin."
          />
        </div>
      </section>

      {/* CTA admin */}
      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary-dark to-blue-800 px-6 py-10 text-white shadow-xl shadow-primary/20 sm:px-10 sm:py-12">
          <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-accent/30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-24 -left-10 size-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Anggota kelas PPLG?</h2>
              <p className="mt-2 max-w-xl text-blue-100 text-pretty">
                Masuk ke panel admin untuk memperbarui prestasi, karya, dan
                dokumentasi kegiatan kelas.
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-primary-dark shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-0 motion-reduce:transform-none"
            >
              <LogIn className="size-4" aria-hidden />
              Masuk Admin
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
