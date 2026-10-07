import { Gamepad2, Trophy } from "lucide-react";

/** Visual dekoratif hero: jendela editor kode + kartu melayang. */
export function HeroMockup() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-md py-6 lg:max-w-none">
      {/* Glow latar */}
      <div className="absolute inset-0 -z-10 rounded-[2rem] bg-linear-to-tr from-primary/25 via-transparent to-accent/20 blur-3xl" />

      <div className="glass overflow-hidden rounded-2xl">
        <div className="flex items-center gap-2 border-b border-slate-900/5 bg-white/40 px-4 py-3">
          <span className="size-3 rounded-full bg-red-400" />
          <span className="size-3 rounded-full bg-amber-400" />
          <span className="size-3 rounded-full bg-emerald-400" />
          <span className="ml-3 truncate rounded-md bg-slate-900/5 px-2 py-0.5 font-mono text-xs text-slate-600">
            kelas-pplg.ts
          </span>
        </div>
        <pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-6 text-slate-800 sm:text-sm sm:leading-7">
          <code>
            <span className="text-primary">const</span> kelas = {"{"}
            {"\n"}
            {"  "}sekolah: <span className="text-accent-strong">&quot;SMKN 9 Semarang&quot;</span>,
            {"\n"}
            {"  "}fokus: [<span className="text-accent-strong">&quot;Aplikasi&quot;</span>,{" "}
            <span className="text-accent-strong">&quot;Gim&quot;</span>],
            {"\n"}
            {"  "}kerjaTim: <span className="text-primary">true</span>,
            {"\n"}
            {"}"};{"\n\n"}
            <span className="text-violet-700">pamerkanKarya</span>(kelas);
            {"\n"}
            <span className="text-slate-500">{"// dari ide menjadi produk"}</span>
          </code>
        </pre>
      </div>

      {/* Kartu melayang */}
      <div className="glass absolute -right-2 top-0 flex items-center gap-3 rounded-xl px-3.5 py-2.5 sm:-right-6">
        <span className="inline-flex size-9 items-center justify-center rounded-lg bg-accent-soft text-accent-strong">
          <Trophy className="size-4" />
        </span>
        <span className="text-sm">
          <span className="block font-semibold text-foreground">Prestasi</span>
          <span className="block text-xs text-muted-foreground">Lomba &amp; kompetisi</span>
        </span>
      </div>
      <div className="glass absolute -left-2 bottom-0 flex items-center gap-3 rounded-xl px-3.5 py-2.5 sm:-left-6">
        <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Gamepad2 className="size-4" />
        </span>
        <span className="text-sm">
          <span className="block font-semibold text-foreground">Proyek Gim</span>
          <span className="block text-xs text-muted-foreground">Dikerjakan tim</span>
        </span>
      </div>
    </div>
  );
}
