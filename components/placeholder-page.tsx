import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <div className="glass rounded-3xl px-6 py-12 text-center sm:px-12">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong ring-1 ring-accent/20">
          <Construction className="size-6" aria-hidden />
        </span>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-accent-strong">
          Segera hadir
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>
        <p className="mx-auto mt-6 max-w-md rounded-xl border border-dashed border-slate-300 bg-white/50 px-4 py-3 text-sm text-muted-foreground">
          Halaman ini akan berisi konten nyata setelah panel admin siap.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 font-medium text-primary transition-colors duration-200 hover:bg-primary-soft hover:text-primary-dark"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
