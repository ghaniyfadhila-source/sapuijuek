export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <div className="glass rounded-2xl p-10 text-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-slate-600">{description}</p>
        <p className="mt-6 text-sm text-slate-400">
          Halaman ini akan berisi konten nyata setelah panel admin siap.
        </p>
      </div>
    </main>
  );
}
